import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Non-threaded emnapi link archive for the BASE wasm build (wasm32-wasip1).
 *
 * WHY THIS EXISTS — napi-build 2.3.2 (src/wasi.rs) unconditionally emits
 *   cargo:rustc-link-lib=static=emnapi-basic-mt
 *   --export=emnapi_async_worker_create / --export=emnapi_async_worker_init
 * for EVERY wasi target. The `-mt` archive is built WITH +atomics: its
 * async-worker objects reference the TLS synthetics `__tls_size` /
 * `__tls_align`, which rust-lld only defines for +atomics modules. Linking a
 * genuinely non-threaded base (no atomics, no SharedArrayBuffer — the #219
 * fix) therefore fails with "undefined symbol: __tls_size / __tls_align".
 *
 * THE FIX (until the napi-build 2.6 / emnapi v2 migration, which selects the
 * archive per target and is out of scope for the split): shadow the archive
 * name napi-build hardcodes. This script generates a link directory holding
 *   libemnapi-basic-mt.a = emnapi's NON-threaded libemnapi-basic.a
 *                        (node_modules/emnapi/lib/wasm32-wasip1 — the variant
 *                        emnapi's README documents for avoiding
 *                        SharedArrayBuffer) + one stub object.
 * Point EMNAPI_LINK_DIR at that directory for the base cargo build. The
 * threaded (shielded) build is untouched and keeps the real -mt archives.
 *
 * THE STUBS — the forced `--export`s must resolve, and the non-threaded
 * archive's wasi_wait.c.obj references a futex helper that non-threaded
 * wasi-libc does not provide. Three never-called functions satisfy the
 * linker (the base is sync-only; async proving lives in the shielded
 * module). Signatures match emnapi src/thread/async_worker_create.c,
 * src/thread/async_worker_init.S and src/wasi_wait.c EXACTLY — wasm-ld
 * checks call-site signatures.
 *
 * LLVM-AR IS REQUIRED — macOS `ar`/ranlib writes a __.SYMDEF archive index
 * rust-lld cannot read ("symbol exported via --export not found" for every
 * archive symbol). The archive is (re)built with llvm-ar.
 *
 * Verified by the Task 2 spike (scripts/spike-base-size.mjs): base links
 * clean, exports `_initialize` + all forced symbols, instantiates
 * single-threaded, 6.26MB after wasm-opt.
 */

// See header: satisfy napi-build 2.3.2's unconditional -mt link lines without
// +atomics/TLS. None of these is ever called by the sync-only base.
const STUBS_RS = `
#[no_mangle]
pub extern "C" fn emnapi_async_worker_create(_directly_spawn: i32, _global_address: *mut u8) -> *mut u8 {
    core::ptr::null_mut()
}
#[no_mangle]
pub extern "C" fn emnapi_async_worker_init(_arg: *mut u8) {}
#[no_mangle]
pub extern "C" fn __wasilibc_futex_wait_atomic_wait(_addr: *mut u8, _op: i32, _val: i32, _max_wait_ns: i64) -> i32 {
    -1
}
`;

// Must match the base build's RUSTFLAGS target features (build.cjs).
export const BASE_TARGET_FEATURES = "+simd128,+bulk-memory,+mutable-globals";

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, stdio: ["ignore", "inherit", "inherit"] });
  if (res.error) {
    throw new Error(`failed to spawn ${cmd}: ${res.error.message}`);
  }
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited with status ${res.status}`);
  }
}

function findLlvmAr() {
  for (const candidate of [
    "llvm-ar",
    "/opt/homebrew/opt/llvm/bin/llvm-ar",
    "/usr/local/opt/llvm/bin/llvm-ar",
  ]) {
    const res = spawnSync(candidate, ["--version"], { stdio: "ignore" });
    if (res.status === 0) return candidate;
  }
  throw new Error(
    "llvm-ar not found (PATH, /opt/homebrew/opt/llvm/bin, /usr/local/opt/llvm/bin). " +
      "macOS `ar` writes a __.SYMDEF archive index rust-lld cannot read; llvm-ar is required " +
      "to build the non-threaded emnapi link archive (utils/prepareEmnapiBaseLink.mjs).",
  );
}

/**
 * Generate the non-threaded emnapi link directory and return its path (to be
 * passed as EMNAPI_LINK_DIR for the base cargo build).
 *
 * @param {object} opts
 * @param {string} opts.toolchain  Rust toolchain compiling the base (stubs are
 *                                 compiled with it for a matching object format).
 * @param {string} opts.linkDir    Output directory (e.g. target/emnapi-base-link).
 * @param {string} [opts.emnapiLibDir]  emnapi non-threaded lib dir; defaults to
 *                                 node_modules/emnapi/lib/wasm32-wasip1.
 * @param {string} [opts.rootDir]  Repo root (defaults to this package's root).
 */
export function prepareEmnapiBaseLink({ toolchain, linkDir, emnapiLibDir, rootDir }) {
  const root = rootDir ?? path.resolve(path.dirname(require.resolve("emnapi")), "..", "..");
  const libDir =
    emnapiLibDir ?? path.join(path.dirname(require.resolve("emnapi")), "lib", "wasm32-wasip1");
  const sourceArchive = path.join(libDir, "libemnapi-basic.a");
  if (!fs.existsSync(sourceArchive)) {
    throw new Error(`non-threaded emnapi archive not found: ${sourceArchive}`);
  }

  fs.mkdirSync(linkDir, { recursive: true });
  const stubsRs = path.join(linkDir, "stubs.rs");
  const stubsObj = path.join(linkDir, "stubs.o");
  const shadowArchive = path.join(linkDir, "libemnapi-basic-mt.a");

  fs.writeFileSync(stubsRs, STUBS_RS);
  run(
    "rustc",
    [
      "+" + toolchain,
      "--target", "wasm32-wasip1",
      "--crate-type", "lib",
      "--emit=obj",
      "-C", "target-feature=" + BASE_TARGET_FEATURES,
      stubsRs,
      "-o", stubsObj,
    ],
    root,
  );

  // Fresh copy every run: llvm-ar `q` APPENDS, so a stale archive would
  // accumulate duplicate stub objects across builds.
  fs.copyFileSync(sourceArchive, shadowArchive);
  run(findLlvmAr(), ["q", shadowArchive, stubsObj], root);

  return linkDir;
}
