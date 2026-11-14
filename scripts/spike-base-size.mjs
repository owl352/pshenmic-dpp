#!/usr/bin/env node
/**
 * THROWAWAY spike — Task 2 of the shielded-split plan (decision gate).
 *
 * Builds the NON-threaded base wasm (wasm32-wasip1, --no-default-features,
 * release-wasm profile), runs the standard scripts/wasm-opt.sh, measures the
 * size against Chrome's 8MB main-thread sync-compile limit, and verifies the
 * base instantiates single-threaded in Node via emnapi (non-shared memory,
 * no workers) with a working data class.
 *
 * Usage: node scripts/spike-base-size.mjs [--toolchain <tc>] [--skip-build]
 *   --toolchain   pin the toolchain (default: try `stable`, then the pinned
 *                 nightly-2026-08-15 fallback; no -Z build-std, no atomics)
 *   --skip-build  reuse the existing target/wasm32-wasip1/release-wasm wasm
 *
 * Exit codes: 0 = A2 viable + instantiation OK, 2 = size gate failed (A1),
 *             1 = build/instantiation error.
 *
 * HISTORY: the 2026-11-14 compile blocker (orchard/multicore pulled into the
 * base via grovedb-commitment-tree) was fixed by Task 1's smart-A1 feature
 * gate (commit e1db36b). The base now compiles, but napi-build 2.3.2 has a
 * non-threaded link quirk: it unconditionally links `libemnapi-basic-mt.a`
 * (the +atomics archive) and force-exports `emnapi_async_worker_create` /
 * `emnapi_async_worker_init`, whose objects reference the TLS symbols
 * `__tls_size` / `__tls_align` that only exist in +atomics builds. Fixed
 * upstream in napi-build 2.6 (thread-aware archive selection, emnapi v2),
 * which is a migration out of scope for this spike.
 *
 * SPIKE-LOCAL WORKAROUND (no production files touched): before building, we
 * create target/spike-emnapi-link/libemnapi-basic-mt.a = the NON-threaded
 * `libemnapi-basic.a` from node_modules/emnapi/lib/wasm32-wasip1 (the variant
 * emnapi's README documents for avoiding SharedArrayBuffer) plus a stub
 * object defining the two forced worker exports and
 * `__wasilibc_futex_wait_atomic_wait` (referenced by wasi_wait.c.obj, absent
 * from non-threaded wasi-libc). The stubs are never called by the sync-only
 * base. EMNAPI_LINK_DIR points at that shadow dir. The archive must be
 * (re)built with llvm-ar: macOS `ar` writes a __.SYMDEF index rust-lld cannot
 * read ("symbol exported via --export not found").
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WASM_PATH = path.join(ROOT, "target/wasm32-wasip1/release-wasm/pshenmic_dpp.wasm");
const EMNAPI_SRC_DIR = path.join(ROOT, "node_modules/emnapi/lib/wasm32-wasip1");
const SHADOW_LINK_DIR = path.join(ROOT, "target/spike-emnapi-link");
const RUSTFLAGS = "-C target-feature=+simd128,+bulk-memory,+mutable-globals";
const CHROME_SYNC_COMPILE_LIMIT = 8 * 1024 * 1024;
const MB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const tcIdx = args.indexOf("--toolchain");
const toolchains = tcIdx !== -1 ? [args[tcIdx + 1]] : ["stable", "nightly-2026-08-15"];

function run(cmd, cmdArgs, env = {}) {
  console.log(`\n$ ${cmd} ${cmdArgs.join(" ")}`);
  const res = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (res.status !== 0) {
    throw new Error(`${cmd} exited with status ${res.status}`);
  }
}

function exportsOf(wasmPath) {
  return WebAssembly.Module.exports(new WebAssembly.Module(fs.readFileSync(wasmPath)));
}

// Signatures match emnapi src/thread/async_worker_create.c,
// src/thread/async_worker_init.S and src/wasi_wait.c exactly (wasm-ld checks
// call-site signatures). None of these is ever called by the sync-only base:
// they exist so napi-build 2.3.2's unconditional -mt link lines resolve
// without +atomics/TLS.
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

function findLlvmAr() {
  for (const candidate of ["llvm-ar", "/opt/homebrew/opt/llvm/bin/llvm-ar", "/usr/local/opt/llvm/bin/llvm-ar"]) {
    const res = spawnSync(candidate, ["--version"], { stdio: "ignore" });
    if (res.status === 0) return candidate;
  }
  throw new Error(
    "llvm-ar not found (PATH, /opt/homebrew/opt/llvm/bin, /usr/local/opt/llvm/bin). " +
      "macOS `ar` writes a __.SYMDEF archive index rust-lld cannot read; llvm-ar is required.",
  );
}

// See the header: shadow `libemnapi-basic-mt.a` with the non-threaded archive
// + stubs so napi-build 2.3.2's hardcoded -mt link lines work without atomics.
function prepareShadowLinkDir(toolchain) {
  fs.mkdirSync(SHADOW_LINK_DIR, { recursive: true });
  const stubsRs = path.join(SHADOW_LINK_DIR, "stubs.rs");
  const stubsObj = path.join(SHADOW_LINK_DIR, "stubs.o");
  const shadowArchive = path.join(SHADOW_LINK_DIR, "libemnapi-basic-mt.a");
  fs.writeFileSync(stubsRs, STUBS_RS);
  run("rustc", [
    "+" + toolchain, "--target", "wasm32-wasip1", "--crate-type", "lib", "--emit=obj",
    "-C", "target-feature=+simd128,+bulk-memory,+mutable-globals",
    stubsRs, "-o", stubsObj,
  ]);
  // Fresh copy every run: llvm-ar `q` APPENDS, a stale stubs.o would duplicate.
  fs.copyFileSync(path.join(EMNAPI_SRC_DIR, "libemnapi-basic.a"), shadowArchive);
  run(findLlvmAr(), ["q", shadowArchive, stubsObj]);
  return SHADOW_LINK_DIR;
}

// ---- Step 1: build the non-threaded base ----------------------------------
let toolchainUsed = null;
if (!skipBuild) {
  // wasm-opt runs in place; without a fresh link a re-run would measure
  // opt(opt(wasm)). Cargo re-links when the output file is missing.
  fs.rmSync(WASM_PATH, { force: true });
  const failures = [];
  for (const tc of toolchains) {
    try {
      run("rustup", ["target", "add", "wasm32-wasip1", "--toolchain", tc]);
      const emnapiLinkDir = prepareShadowLinkDir(tc);
      console.log(`[spike] EMNAPI_LINK_DIR=${emnapiLinkDir} (non-mt archive + stubs, see header)`);
      run(
        "cargo",
        ["+" + tc, "build", "--target", "wasm32-wasip1", "--no-default-features", "--profile", "release-wasm"],
        { RUSTFLAGS, EMNAPI_LINK_DIR: emnapiLinkDir },
      );
      toolchainUsed = tc;
      break;
    } catch (err) {
      failures.push(`${tc}: ${err.message}`);
      console.error(`\n[spike] toolchain ${tc} failed:\n${failures.at(-1)}`);
    }
  }
  if (!toolchainUsed) {
    console.error("[spike] all toolchains failed:\n" + failures.join("\n"));
    process.exit(1);
  }
} else {
  toolchainUsed = "(skipped build)";
  if (!fs.existsSync(WASM_PATH)) {
    console.error(`[spike] no wasm at ${WASM_PATH}; run without --skip-build`);
    process.exit(1);
  }
}
console.log(`\n[spike] toolchain used: ${toolchainUsed}`);

// ---- Carry-forward from Task 1: _initialize MUST be exported --------------
// A missing _initialize means crt1-reactor.o was not linked and emnapi never
// runs constructors -> import deadlock. Check BEFORE wasm-opt.
const exportsBefore = exportsOf(WASM_PATH);
const hasInitialize = exportsBefore.some((e) => e.name === "_initialize");
console.log(`[spike] _initialize export present (pre-opt): ${hasInitialize ? "YES" : "NO"}`);
if (!hasInitialize) {
  console.error("[spike] FATAL: wasm does not export `_initialize` (crt1-reactor.o not linked)");
  process.exit(1);
}

// ---- Steps 2-3: wasm-opt + measure + decision gate -------------------------
const sizeBefore = fs.statSync(WASM_PATH).size;
run("bash", [path.join(ROOT, "scripts/wasm-opt.sh")], { OUTPUT_FILE: WASM_PATH });
const sizeAfter = fs.statSync(WASM_PATH).size;
const exportsAfter = exportsOf(WASM_PATH);
const hasInitializeAfter = exportsAfter.some((e) => e.name === "_initialize");

console.log("\n========== MEASUREMENT ==========");
console.log(`wasm: ${WASM_PATH}`);
console.log(`size BEFORE wasm-opt: ${MB(sizeBefore)} MB (${sizeBefore} bytes)`);
console.log(`size AFTER  wasm-opt: ${MB(sizeAfter)} MB (${sizeAfter} bytes)`);
console.log(`_initialize present after opt: ${hasInitializeAfter ? "YES" : "NO"}`);
const a2Viable = sizeAfter < CHROME_SYNC_COMPILE_LIMIT && hasInitializeAfter;
console.log(
  a2Viable
    ? `DECISION: ${MB(sizeAfter)} MB < 8 MB -> A2 VIABLE (base + on-demand threaded proving module)`
    : `DECISION: ${MB(sizeAfter)} MB >= 8 MB (or _initialize missing) -> A2 NOT VIABLE, ESCALATE TO A1`,
);
console.log("=================================\n");

// ---- Step 4: single-threaded instantiation check ---------------------------
// Adapted from templates/binaries/wasmCreation.cjs (main-thread block), minus
// workers/shared memory: emnapi instantiateNapiModuleSync + @tybys/wasm-util
// WASI, NON-shared WebAssembly.Memory. wasi.initialize() runs `_initialize`;
// beforeInit runs the __napi_register__* constructors.
const { WASI } = require("@tybys/wasm-util");
const { getDefaultContext } = require("@emnapi/runtime");
const { instantiateNapiModuleSync } = require("@emnapi/core");

const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;

const wasi = new WASI({
  version: "preview1",
  print: (...a) => console.log(...a),
  printErr: (...a) => console.error(...a),
});

const memory = new WebAssembly.Memory({ initial: 1000, maximum: 12000, shared: false });

console.log("[spike] instantiating base wasm single-threaded (non-shared memory, no workers)...");
const t0 = Date.now();
const wasm = instantiateNapiModuleSync(fs.readFileSync(WASM_PATH), {
  context: emnapiContext,
  wasi,
  overwriteImports(importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi,
      memory,
    };
  },
  beforeInit({ instance }) {
    for (const name of Object.keys(instance.exports)) {
      if (name.startsWith("__napi_register__")) {
        instance.exports[name]();
      }
    }
  },
});
console.log(`[spike] instantiation + constructors OK in ${Date.now() - t0} ms (no deadlock)`);

const napiExports = wasm.napiModule.exports;
const assert = (cond, msg) => {
  if (!cond) throw new Error(`assertion failed: ${msg}`);
};

// Data class round-trip: IdentifierNAPI.fromBase58 -> bytes.
const B58 = "ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U";
assert(typeof napiExports.IdentifierNAPI?.fromBase58 === "function", "IdentifierNAPI.fromBase58 exported");
const id = napiExports.IdentifierNAPI.fromBase58(B58);
const bytes = id.bytes();
assert(bytes instanceof Uint8Array, "bytes() returns Uint8Array");
assert(bytes.length === 32, `identifier is 32 bytes (got ${bytes.length})`);
assert(id.base58() === B58, "base58 round-trip");
console.log(`[spike] IdentifierNAPI.fromBase58(...).bytes() -> Uint8Array(${bytes.length}), round-trip OK`);

// The proving feature is OFF: proving classes must NOT be registered.
for (const provingClass of ["ShieldedBuilderNAPI", "OrchardProverNAPI"]) {
  assert(napiExports[provingClass] === undefined, `${provingClass} absent from base exports`);
}
console.log("[spike] proving classes (ShieldedBuilderNAPI, OrchardProverNAPI) absent from base: OK");

console.log(`\n[spike] RESULT: ${a2Viable ? "A2 VIABLE" : "A2 NOT VIABLE -> A1"}; base ${MB(sizeAfter)} MB; instantiation PASS`);
process.exit(a2Viable ? 0 : 2);