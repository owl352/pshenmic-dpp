const path = require("node:path");
const toml = require("toml");
const { exec } = require("child_process");
const { promisify } = require("node:util");
const fs = require("fs");
const { convertBinary } = require("./utils/convertBinary.mjs");
const { buildWorkerBundle } = require("./utils/buildWorkerBundle.mjs");
const {
  prepareEmnapiBaseLink,
  BASE_TARGET_FEATURES,
} = require("./utils/prepareEmnapiBaseLink.mjs");
const {
  getStructsForEsmExport,
} = require("./utils/getStructsForEsmExport.mjs");
const { name: moduleName } = require("./package.json");
const typingsForCodegen = 'export * from "./bindingsTypes.ts"';

const buildProfile = process.env.PROFILE ?? "release";
const isRelease = buildProfile === "release";
// Release wasm builds use the size-optimized `release-wasm` profile (Cargo.toml)
// to stay under Chrome's 8MB sync-compile limit.
const wasmProfile = isRelease ? "release-wasm" : buildProfile;
// Chrome refuses to sync-compile wasm larger than 8MB on the main thread.
// BOTH binaries are sync-compiled there: the base at import time, the shielded
// at initShielded() time (instantiateNapiModuleSync). The shielded load is off
// the import path, but the same limit applies.
const CHROME_SYNC_COMPILE_LIMIT = 8 * 1024 * 1024;
// Toolchain used only for the SHIELDED wasm build (needs nightly `-Z build-std`
// to rebuild std with atomics for the Orchard/Halo 2 proving stack). Pinnable so
// published artifacts are reproducible and immune to nightly flag churn.
const wasmToolchain = process.env.WASM_TOOLCHAIN ?? "nightly";
// The BASE wasm is non-threaded: no build-std/atomics/tokio_unstable needed, so
// it builds on stable. Fall back to the pinned nightly-2026-08-15 (still no
// build-std/atomics) if stable ever fails; BASE_WASM_TOOLCHAIN pins a single
// toolchain for reproducibility.
const baseWasmToolchains = process.env.BASE_WASM_TOOLCHAIN
  ? [process.env.BASE_WASM_TOOLCHAIN]
  : ["stable", "nightly-2026-08-15"];
const wasmOptScript =
  process.env.WASM_OPT_SCRIPT ?? path.join(__dirname, "scripts/wasm-opt.sh");
const binariesOutputDir =
  process.env.BIN_OUTPUT_DIR ?? path.join(__dirname, "pkg", "binaries");
const templatesOutputDir =
  process.env.JS_OUTPUT_DIR ?? path.join(__dirname, "pkg");
// The shielded (proving) wasm + worker bundle ship in the separate
// pshenmic-orchard package, not in dpp's binaries.
const orchardDir = path.join(__dirname, "packages", "orchard");
const orchardWasmOutputDir = path.join(orchardDir, "binaries", "wasm");

const specificTarget = process.env.NATIVE_BUILD_TARGET;
// BUILD_STEPS selects what to build, so CI can run the slow parts as parallel
// jobs and assemble the package afterwards. Default: everything.
//   wasm          BOTH wasm binaries -> binaries/wasm:
//                   base:     wasm32-wasip1 (non-threaded, --no-default-features,
//                             stable) -> baseBytes.cjs. Sync-loaded at import
//                             without cross-origin isolation; MUST stay < 8MB
//                             (Chrome main-thread sync-compile limit).
//                   shielded: wasm32-wasip1-threads (nightly, proving on) ->
//                             shieldedBytes.cjs + workerBundle.cjs. Loaded on
//                             demand via initShielded() (shared memory/workers).
//   native        NATIVE_BUILD_TARGET bins -> binaries/native/<target>
//   react-native  ferric-cli Android/iOS bins (+ napi typings)
//   typings       napi typings only (what react-native also generates)
//   bundle        templates + exports/typings codegen from the outputs above
const ALL_STEPS = ["wasm", "native", "react-native", "typings", "bundle"];
const buildSteps = new Set(
  (process.env.BUILD_STEPS ?? "wasm,native,react-native,bundle").split(",").map(s => s.trim()),
);
for (const step of buildSteps) {
  if (!ALL_STEPS.includes(step)) {
    throw new Error(`unknown BUILD_STEPS entry "${step}", expected: ${ALL_STEPS.join(", ")}`);
  }
}

const nativeTargets = specificTarget
  ? specificTarget.split(',').map(t => t.trim())
  : [
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-unknown-linux-musl",
    "aarch64-unknown-linux-musl",
    "x86_64-pc-windows-msvc",
    "aarch64-pc-windows-msvc",
  ];

// Threaded emnapi archives for the shielded build.
const emnapi = path.join(
  require.resolve("emnapi"),
  "..",
  "lib",
  "wasm32-wasi-threads",
);
// Non-threaded emnapi variant for the base build. napi-build 2.3.2 hardcodes
// the +atomics `-mt` archive name, so the base links against a generated
// shadow of this dir's libemnapi-basic.a (utils/prepareEmnapiBaseLink.mjs).
const emnapiBase = path.join(
  require.resolve("emnapi"),
  "..",
  "lib",
  "wasm32-wasip1",
);

const cargoTomlPath = path.join(__dirname, "Cargo.toml");
const fileContent = fs.readFileSync(cargoTomlPath, "utf8");
const {
  package: { name: rustCrateName },
} = toml.parse(fileContent);

const binName = rustCrateName.replace(/-/g, "_");
const execTask = promisify(exec);

async function main() {
  if (buildSteps.has("wasm")) await buildWasm();
  if (buildSteps.has("native")) await buildNative();
  if (buildSteps.has("react-native")) await buildReactNative();
  if (buildSteps.has("typings")) await generateTypings();
  if (buildSteps.has("bundle")) bundle();

  console.log("Done");
}

async function buildWasm() {
  await buildBaseWasm();
  await buildShieldedWasm();
}

// The base is the non-threaded binary the browser entry sync-loads at import
// time WITHOUT cross-origin isolation (dash-platform-extension#219): no
// atomics, no SharedArrayBuffer, no workers, proving feature OFF.
async function buildBaseWasm() {
  console.log("--- Building base WASM (wasm32-wasip1, non-threaded) ---");
  const targetWasmFile = path.join(
    __dirname, "target", "wasm32-wasip1", wasmProfile, `${binName}.wasm`
  );
  const wasmOutputDir = path.join(binariesOutputDir, "wasm");

  // wasm-opt rewrites the artifact in place; force a fresh link so a rebuild
  // never measures/ship opt(opt(wasm)). Cargo re-links when the output is
  // missing (compile cache is untouched).
  fs.rmSync(targetWasmFile, { force: true });

  // Stable first; pinned nightly fallback WITHOUT build-std/atomics/
  // tokio_unstable (the base needs none of them). RUSTFLAGS is set explicitly
  // so it wins over any inherited RUSTFLAGS (e.g. CI's `-crt-static`);
  // .cargo/config.toml's atomics flags are scoped to the -threads target only.
  const failures = [];
  let toolchainUsed = null;
  for (const tc of baseWasmToolchains) {
    try {
      await execTask(`rustup target add wasm32-wasip1 --toolchain ${tc}`, {
        env: { ...process.env },
      });
      // napi-build 2.3.2 hardcodes the +atomics emnapi archive, which cannot
      // link without TLS; generate the non-threaded shadow archive + stubs.
      const emnapiLinkDir = prepareEmnapiBaseLink({
        toolchain: tc,
        linkDir: path.join(__dirname, "target", "emnapi-base-link"),
        emnapiLibDir: emnapiBase,
        rootDir: __dirname,
      });
      await execTask(
        `cargo +${tc} build --target wasm32-wasip1 --no-default-features ${isRelease ? `--profile ${wasmProfile}` : ""}`,
        {
          env: {
            ...process.env,
            EMNAPI_LINK_DIR: emnapiLinkDir,
            RUSTFLAGS: `-C target-feature=${BASE_TARGET_FEATURES}`,
          },
          maxBuffer: 1024 * 1024 * 50,
        }
      );
      toolchainUsed = tc;
      break;
    } catch (error) {
      failures.push(`${tc}: ${error.message}`);
      console.error(`base wasm build with ${tc} failed:\n${error.stderr ?? error.message}`);
    }
  }
  if (toolchainUsed === null) {
    throw new Error(`base wasm build failed on all toolchains:\n${failures.join("\n")}`);
  }
  console.log(`base wasm toolchain: ${toolchainUsed}`);

  assertInitializeExport(targetWasmFile, "base");

  console.log("Running wasm-opt (base)");
  await execTask(wasmOptScript, {
    env: { ...process.env, OUTPUT_FILE: targetWasmFile.toString() },
  });

  // The base is instantiated synchronously at import time, so it must stay
  // under Chrome's main-thread sync-compile limit (see the constant above).
  const wasmSize = fs.statSync(targetWasmFile).size;
  if (wasmSize >= CHROME_SYNC_COMPILE_LIMIT) {
    throw new Error(
      `base wasm binary is ${(wasmSize / 1024 / 1024).toFixed(2)}MB — over Chrome's ` +
      "8MB main-thread sync-compile limit; the browser build would break at import time.",
    );
  }
  console.log(`base wasm size after wasm-opt: ${(wasmSize / 1024 / 1024).toFixed(2)}MB`);

  if (!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir, { recursive: true });
  }
  // Pre-split single-binary output; drop it so stale bytes never ship.
  fs.rmSync(path.join(wasmOutputDir, "wasmBytes.cjs"), { force: true });

  await convertBinary(targetWasmFile, path.join(wasmOutputDir, "baseBytes.cjs"));
}

// The shielded binary carries the Orchard/Halo 2 proving stack: wasm
// threads/atomics, shared memory, workers. Loaded on demand via initShielded().
async function buildShieldedWasm() {
  console.log("--- Building shielded WASM (wasm32-wasip1-threads) ---");
  const targetWasmFile = path.join(
    __dirname, "target", "wasm32-wasip1-threads", wasmProfile, `${binName}.wasm`
  );

  // Fresh link before wasm-opt (see buildBaseWasm): never opt(opt(wasm)).
  fs.rmSync(targetWasmFile, { force: true });

  // The shielded (Orchard/Halo 2) proving stack needs wasm threads/atomics,
  // which require rebuilding std with atomics: nightly + `-Z build-std`.
  // `panic_immediate_abort` drops std's panic-formatting machinery to shrink the
  // binary (matches our `panic = "abort"` release profile). RUSTFLAGS is set
  // explicitly here so it wins over any inherited RUSTFLAGS (e.g. CI's
  // `-crt-static`), which would otherwise override .cargo/config.toml and drop
  // the atomics flags. Native builds keep the inherited env.
  // `optimize_for_size` makes std use its compact implementations (notably
  // slice::sort, monomorphized hundreds of times by the BTreeMap collects in
  // dpp). It replaces std's default features, which also drops `backtrace`
  // (rustc_demangle), unused under immediate-abort panics. ~270KB smaller,
  // no measurable proving slowdown.
  // `--cfg tokio_unstable` is what makes napi (>=3.11) treat the target as
  // threaded and run async `#[napi]` fns / `spawn_future` (the proving stack)
  // on tokio; without it napi compiles that path out and every async call
  // rejects with "Built-in Tokio async tasks require a threaded WASI target".
  await execTask(
    `cargo +${wasmToolchain} build --target wasm32-wasip1-threads -Z unstable-options -Z build-std=std,panic_abort -Z build-std-features=optimize_for_size ${isRelease ? `--profile ${wasmProfile}` : ""}`,
    {
      env: {
        ...process.env,
        EMNAPI_LINK_DIR: emnapi,
        RUSTFLAGS:
          "-C target-feature=+atomics,+simd128,+bulk-memory,+mutable-globals -Z unstable-options -C panic=immediate-abort --cfg tokio_unstable",
      },
      maxBuffer: 1024 * 1024 * 50,
    }
  );

  assertInitializeExport(targetWasmFile, "shielded");

  console.log("Running wasm-opt (shielded)");
  await execTask(wasmOptScript, {
    env: { ...process.env, OUTPUT_FILE: targetWasmFile.toString() },
  });
  // The shielded module is compiled on demand (initShielded()), but still
  // SYNCHRONOUSLY on the main thread (instantiateNapiModuleSync), so Chrome's
  // 8MB sync-compile limit applies here too — just off the import path. Guard
  // it so growth fails the build instead of breaking initShielded() in the
  // browser (headroom was ~0.22MB at 7.78MB when the guard was added).
  const wasmSize = fs.statSync(targetWasmFile).size;
  if (wasmSize >= CHROME_SYNC_COMPILE_LIMIT) {
    throw new Error(
      `shielded wasm binary is ${(wasmSize / 1024 / 1024).toFixed(2)}MB — over Chrome's ` +
      "8MB main-thread sync-compile limit; initShielded() would fail in the browser.",
    );
  }
  console.log(`shielded wasm size after wasm-opt: ${(wasmSize / 1024 / 1024).toFixed(2)}MB`);

  if (!fs.existsSync(orchardWasmOutputDir)) {
    fs.mkdirSync(orchardWasmOutputDir, { recursive: true });
  }

  await convertBinary(targetWasmFile, path.join(orchardWasmOutputDir, "shieldedBytes.cjs"));

  buildWorkerBundle(path.join(orchardWasmOutputDir, "workerBundle.cjs"));
}

// Without `_initialize` emnapi never runs the module's constructors and the
// import deadlocks (see build.rs). Fail here instead of shipping a wasm that
// hangs. Checked BEFORE wasm-opt so a bad link is reported against the
// linker's output, not the optimizer's. `label` distinguishes base vs shielded
// (both binaries share the same file name).
function assertInitializeExport(targetWasmFile, label) {
  const wasmExports = WebAssembly.Module.exports(
    new WebAssembly.Module(fs.readFileSync(targetWasmFile)),
  );
  if (!wasmExports.some((e) => e.name === "_initialize")) {
    throw new Error(
      `${label} wasm (${path.basename(targetWasmFile)}) does not export \`_initialize\`: crt1-reactor.o was not linked`,
    );
  }
}

async function buildNative() {
  console.log("--- Building Native Binaries ---");

  const darwinTargets = nativeTargets.filter(t => t.includes("apple-darwin"));
  // zig cannot emit the MSVC ABI, so windows goes through cargo-xwin (clang-cl
  // + lld-link against the Microsoft CRT/SDK headers xwin downloads).
  const windowsTargets = nativeTargets.filter(t => t.includes("windows"));
  const zigbuildTargets = nativeTargets.filter(
    t => !t.includes("apple-darwin") && !t.includes("windows")
  );

  if (darwinTargets.length > 0) {
    const targetFlags = darwinTargets.map(t => `--target ${t}`).join(" ");
    console.log(`Building darwin targets with cargo: ${darwinTargets.join(", ")}...`);

    await execTask(
      `cargo build ${targetFlags} ${isRelease ? "--release" : ""}`,
      { env: { ...process.env }, maxBuffer: 1024 * 1024 * 50 }
    );
  }

  if (zigbuildTargets.length > 0) {
    const targetFlags = zigbuildTargets.map(t => `--target ${t}`).join(" ");
    console.log(`Building cross targets with zigbuild: ${zigbuildTargets.join(", ")}...`);

    await execTask(
      `cargo zigbuild ${targetFlags} ${isRelease ? "--release" : ""}`,
      { env: { ...process.env }, maxBuffer: 1024 * 1024 * 50 }
    );
  }

  // One invocation per windows target: cargo-xwin injects the SDK/CRT lib
  // paths via RUSTFLAGS, and with several `--target` flags only the last
  // target's paths survive, so the others fail to link ("machine type x64
  // conflicts with arm64"). Requires XWIN_ACCEPT_LICENSE=1 in the environment
  // (accepts Microsoft's license for the CRT/SDK headers xwin downloads).
  for (const target of windowsTargets) {
    console.log(`Building windows target with xwin: ${target}...`);

    await execTask(
      `cargo xwin build --target ${target} ${isRelease ? "--release" : ""}`,
      { env: { ...process.env }, maxBuffer: 1024 * 1024 * 50 }
    );
  }

  nativeTargets.forEach((target) => {
    let extension;
    // MSVC emits `pshenmic_dpp.dll`; the unix toolchains prefix with `lib`.
    let prefix = "lib";

    if (target.includes("apple-darwin")) {
      extension = "dylib";
    } else if (target.includes("windows")) {
      extension = "dll";
      prefix = "";
    } else {
      extension = "so";
    }

    const nativeBinPath = path.join(
      __dirname, "target", target, buildProfile, `${prefix}${binName}.${extension}`
    );

    const nativeOutputDir = path.join(binariesOutputDir, "native", target);

    if (fs.existsSync(nativeBinPath)) {
      if (!fs.existsSync(nativeOutputDir)) {
        fs.mkdirSync(nativeOutputDir, { recursive: true });
      }

      const destPath = path.join(nativeOutputDir, `${binName}.node`);

      fs.copyFileSync(nativeBinPath, destPath);
      console.log(`Successfully built and copied: ${target}`);
    } else {
      throw new Error(`native build output not found for ${target}: ${nativeBinPath}`);
    }
  });
}

async function buildReactNative() {
  console.log("Running ferric-cli");
  await execTask(
    `npm run ferric:build -- --configuration ${buildProfile} --output ${binariesOutputDir}`,
    {
      env: {
        ...process.env,
        AWS_LC_SYS_TARGET_CC_aarch64_apple_darwin: "/usr/bin/cc",
        AWS_LC_SYS_TARGET_CXX_aarch64_apple_darwin: "/usr/bin/c++",
      },
      maxBuffer: 1024 * 1024 * 50,
    },
  );
}

function bundle() {
  console.log("--- Post-build processing ---");

  console.log("Copying templates");
  fs.cpSync("./templates", templatesOutputDir, { recursive: true });

  console.log("Building pshenmic-orchard dist");
  fs.cpSync(path.join(orchardDir, "src"), path.join(orchardDir, "dist"), { recursive: true });

  console.log("Patching exports and typings...");
  const wasmTypesPath = path.join(binariesOutputDir, `${binName}.d.ts`);
  // A previous bundle replaces the napi typings with a re-export.
  if (!fs.existsSync(wasmTypesPath) || fs.readFileSync(wasmTypesPath, "utf8") === typingsForCodegen) {
    throw new Error(`no napi typings at ${wasmTypesPath}: run the typings or react-native step first`);
  }
  const exports = getStructsForEsmExport(wasmTypesPath.toString());

  fs.writeFileSync(
    path.join(binariesOutputDir, `${binName}.js`),
    [
      "/* eslint-disable */",
      "import {requireNodeAddon} from 'react-native-node-api'",
      `export const { ${exports.join(", ")} } = requireNodeAddon('./${moduleName}--${binName}')`,
    ].join("\n\n") + "\n",
    "utf8",
  );

  const wasmInitScript = fs.readFileSync(
    path.join(binariesOutputDir, "wasm.js"),
    { encoding: "utf8" },
  );


  fs.writeFileSync(
    path.join(binariesOutputDir, "wasm.js"),
    wasmInitScript.replace(
      "/* exports here */",
      `export const { ${exports.join(", ")} }`,
    ),
  );

  const types = fs.readFileSync(wasmTypesPath, { encoding: "utf8" });
  fs.writeFileSync(
    path.join(binariesOutputDir, "bindingsTypes.ts"),
    types.replace(/declare const/g, "const").replace(/const enum/g, 'enum'),
  );

  fs.writeFileSync(path.join(binariesOutputDir, "wasm.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, "wasmCreation.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, "node.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, `${binName}.d.ts`), typingsForCodegen);
}

// What ferric-cli does after building the bins: a host `napi build --dts` into
// a temp dir (so its .node output doesn't land in the package), keeping only
// the declarations.
async function generateTypings() {
  const { NapiCli } = await import("@napi-rs/cli");
  const tempDir = fs.mkdtempSync(path.join(__dirname, "dts-tmp-"));

  // Same override ferric-cli gets above: this is a host build, and on macOS
  // with Homebrew's clang first in PATH aws-lc must use the system compiler.
  if (process.platform === "darwin") {
    process.env.AWS_LC_SYS_TARGET_CC_aarch64_apple_darwin ??= "/usr/bin/cc";
    process.env.AWS_LC_SYS_TARGET_CXX_aarch64_apple_darwin ??= "/usr/bin/c++";
  }

  try {
    fs.writeFileSync(path.join(tempDir, "package.json"), "{}");

    const { task } = await new NapiCli().build({
      dts: `${binName}.d.ts`,
      outputDir: tempDir,
      cwd: __dirname,
      cargoOptions: ["--quiet"],
    });
    await task;

    fs.copyFileSync(
      path.join(tempDir, `${binName}.d.ts`),
      path.join(binariesOutputDir, `${binName}.d.ts`),
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
