const path = require("node:path");
const toml = require("toml");
const { exec } = require("child_process");
const { promisify } = require("node:util");
const fs = require("fs");
const { convertBinary } = require("./utils/convertBinary.mjs");
const {
  getStructsForEsmExport,
} = require("./utils/getStructsForEsmExport.mjs");
const { name: moduleName } = require("./package.json");
const typingsForCodegen = 'export * from "./bindingsTypes.ts"';

const buildProfile = process.env.PROFILE ?? "release";
const isRelease = buildProfile === "release";
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

  await execTask(
    `cargo build --target wasm32-wasip1-threads ${isRelease ? "--release" : ""}`,
    { env: { ...process.env, EMNAPI_LINK_DIR: emnapi } }
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

  const wasmOutputDir = path.join(binariesOutputDir, "wasm");
  if (!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir, { recursive: true });
  }

  await convertBinary(targetWasmFile, path.join(wasmOutputDir, "wasmBytes.cjs"));

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
    types.replace(/declare const/g, "const"),
  );

  fs.writeFileSync(path.join(binariesOutputDir, "wasm.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, "wasmCreation.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, "node.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, `${binName}.d.ts`), typingsForCodegen);

  console.log("Done");
}

main().catch(console.error);
