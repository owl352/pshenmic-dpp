const path = require("node:path");
const toml = require("toml");
const { exec } = require("child_process");
const { promisify } = require("node:util");
const fs = require("fs");
const { convertBinary } = require("./utils/convertBinary.mjs");
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
// The base binary is sync-compiled there at import time, so it must stay
// under this limit.
const CHROME_SYNC_COMPILE_LIMIT = 8 * 1024 * 1024;
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

const specificTarget = process.env.NATIVE_BUILD_TARGET;
// BUILD_STEPS selects what to build, so CI can run the slow parts as parallel
// jobs and assemble the package afterwards. Default: everything.
//   wasm          base wasm binary -> binaries/wasm/baseBytes.cjs:
//                   wasm32-wasip1 (non-threaded, --no-default-features,
//                   stable). Sync-loaded at import without cross-origin
//                   isolation; MUST stay < 8MB (Chrome main-thread
//                   sync-compile limit).
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

// Without `_initialize` emnapi never runs the module's constructors and the
// import deadlocks (see build.rs). Fail here instead of shipping a wasm that
// hangs. Checked BEFORE wasm-opt so a bad link is reported against the
// linker's output, not the optimizer's.
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
