const path = require("node:path");
const toml = require("toml");
const { exec } = require("child_process");
const { promisify } = require("node:util");
const fs = require("fs");
const { convertBinary } = require("./utils/convertBinary.mjs");
const { buildWorkerBundle } = require("./utils/buildWorkerBundle.mjs");
const {
  getStructsForEsmExport,
} = require("./utils/getStructsForEsmExport.mjs");
const { name: moduleName } = require("./package.json");
const typingsForCodegen = 'export * from "./bindingsTypes.ts"';

const buildProfile = process.env.PROFILE ?? "release";
const isRelease = buildProfile === "release";
// Toolchain used only for the wasm build (needs nightly `-Z build-std` to
// rebuild std with atomics for the Orchard/Halo 2 proving stack). Pinnable so
// published artifacts are reproducible and immune to nightly flag churn.
const wasmToolchain = process.env.WASM_TOOLCHAIN ?? "nightly";
const wasmOptScript =
  process.env.WASM_OPT_SCRIPT ?? path.join(__dirname, "scripts/wasm-opt.sh");
const binariesOutputDir =
  process.env.BIN_OUTPUT_DIR ?? path.join(__dirname, "pkg", "binaries");
const templatesOutputDir =
  process.env.JS_OUTPUT_DIR ?? path.join(__dirname, "pkg");

const specificTarget = process.env.NATIVE_BUILD_TARGET;

const nativeTargets = specificTarget
  ? specificTarget.split(',').map(t => t.trim())
  : [
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-unknown-linux-musl",
    "aarch64-unknown-linux-musl",
    // "x86_64-pc-windows-msvc",
    // "aarch64-pc-windows-msvc"
  ];

const emnapi = path.join(
  require.resolve("emnapi"),
  "..",
  "lib",
  "wasm32-wasi-threads",
);

const cargoTomlPath = path.join(__dirname, "Cargo.toml");
const fileContent = fs.readFileSync(cargoTomlPath, "utf8");
const {
  package: { name: rustCrateName },
} = toml.parse(fileContent);

const binName = rustCrateName.replace(/-/g, "_");
const execTask = promisify(exec);

async function main() {
  console.log("--- Building WASM (wasm32-wasip1-threads) ---");
  const targetWasmFile = path.join(
    __dirname, "target", "wasm32-wasip1-threads", buildProfile, `${binName}.wasm`
  );

  // The shielded (Orchard/Halo 2) proving stack needs wasm threads/atomics,
  // which require rebuilding std with atomics: nightly + `-Z build-std`.
  // `panic_immediate_abort` drops std's panic-formatting machinery to shrink the
  // binary (matches our `panic = "abort"` release profile). RUSTFLAGS is set
  // explicitly here so it wins over any inherited RUSTFLAGS (e.g. CI's
  // `-crt-static`), which would otherwise override .cargo/config.toml and drop
  // the atomics flags. Native builds below keep the inherited env.
  await execTask(
    `cargo +${wasmToolchain} build --target wasm32-wasip1-threads -Z unstable-options -Z build-std=std,panic_abort ${isRelease ? "--release" : ""}`,
    {
      env: {
        ...process.env,
        EMNAPI_LINK_DIR: emnapi,
        RUSTFLAGS:
          "-C target-feature=+atomics,+simd128,+bulk-memory,+mutable-globals -Z unstable-options -C panic=immediate-abort",
      },
    }
  );

  console.log("--- Building Native Binaries ---");

  const darwinTargets = nativeTargets.filter(t => t.includes("apple-darwin"));
  const zigbuildTargets = nativeTargets.filter(t => !t.includes("apple-darwin"));

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

  nativeTargets.forEach((target) => {
    let extension;

    if (target.includes("apple-darwin")) {
      extension = "dylib";
    } else if (target.includes("windows")) {
      extension = "dll";
    } else {
      extension = "so";
    }

    const nativeBinPath = path.join(
      __dirname, "target", target, buildProfile, `lib${binName}.${extension}`
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
      console.error(`FAILED: File not found for ${target}: ${nativeBinPath}`);
    }
  });

  console.log("--- Post-build processing ---");

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

  console.log("Running wasm-opt");
  await execTask(wasmOptScript, {
    env: { ...process.env, OUTPUT_FILE: targetWasmFile.toString() },
  });

  // Chrome refuses to sync-compile wasm larger than 8MB on the main thread,
  // and the browser entry instantiates synchronously at import time.
  const CHROME_SYNC_COMPILE_LIMIT = 8 * 1024 * 1024;
  const wasmSize = fs.statSync(targetWasmFile).size;
  if (wasmSize >= CHROME_SYNC_COMPILE_LIMIT) {
    throw new Error(
      `wasm binary is ${(wasmSize / 1024 / 1024).toFixed(2)}MB — over Chrome's ` +
      "8MB main-thread sync-compile limit; the browser build would break at import time.",
    );
  }
  console.log(`wasm size after wasm-opt: ${(wasmSize / 1024 / 1024).toFixed(2)}MB`);

  const wasmOutputDir = path.join(binariesOutputDir, "wasm");
  if (!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir, { recursive: true });
  }

  await convertBinary(targetWasmFile, path.join(wasmOutputDir, "wasmBytes.cjs"));

  buildWorkerBundle(path.join(wasmOutputDir, "workerBundle.cjs"));

  console.log("Copying templates");
  fs.cpSync("./templates", templatesOutputDir, { recursive: true });

  console.log("Patching exports and typings...");
  const wasmTypesPath = path.join(binariesOutputDir, `${binName}.d.ts`);
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

  console.log("Done");
}

main().catch(console.error);
