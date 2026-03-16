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

const specificTarget = process.env.CARGO_BUILD_TARGET;

const nativeTargets = specificTarget
  ? [specificTarget] // Если таргет передан, собираем только его
  : [
    // Твой дефолтный список для локальной разработки (когда запускаешь просто node build.cjs)
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-unknown-linux-musl",
    "aarch64-unknown-linux-musl",
    "x86_64-pc-windows-msvc",
    "aarch64-pc-windows-msvc"
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

  console.log("--- Building Native Binaries via zigbuild ---");
  for (const target of nativeTargets) {
    try {
      console.log(`Building for target: ${target}...`);

      const existingRUSTFLAGS = process.env.RUSTFLAGS || "";
      await execTask(
        `cargo zigbuild --target ${target} ${isRelease ? "--release" : ""}`,
        { env: {
            ...process.env,
            RUSTFLAGS: `${existingRUSTFLAGS} --crate-type=cdylib`.trim()
          }}
      );

      let extension

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
      if (!fs.existsSync(nativeOutputDir)) {
        fs.mkdirSync(nativeOutputDir, { recursive: true });
      }

      const destPath = path.join(nativeOutputDir, `${binName}.node`);
      fs.copyFileSync(nativeBinPath, destPath);
      console.log(`Successfully built: ${target}`);

    } catch (err) {
      console.error(`FAILED to build for target ${target}:`, err.message);
    }
  }

  console.log("--- Post-build processing ---");

  await execTask(
    `npm run ferric:build -- --configuration ${buildProfile} --output ${binariesOutputDir}`,
  );

  console.log("Running wasm-opt");
  await execTask(wasmOptScript, {
    env: { ...process.env, OUTPUT_FILE: targetWasmFile.toString() },
  });

  const wasmOutputDir = path.join(binariesOutputDir, "wasm");
  if (!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir, { recursive: true });
  }

  await convertBinary(targetWasmFile, path.join(wasmOutputDir, "wasmBytes.ts"));

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
  const nativeInitScript = fs.readFileSync(
    path.join(binariesOutputDir, "native.js"),
    { encoding: "utf8" },
  );


  fs.writeFileSync(
    path.join(binariesOutputDir, "wasm.js"),
    wasmInitScript.replace(
      "/* exports here */",
      `export const { ${exports.join(", ")} } =`,
    ),
  );

  fs.writeFileSync(
    path.join(binariesOutputDir, "native.js"),
    nativeInitScript.replace(
      "/* exports here */",
      `export const { ${exports.join(", ")} } =`,
    ),
  );

  const types = fs.readFileSync(wasmTypesPath, { encoding: "utf8" });
  fs.writeFileSync(
    path.join(binariesOutputDir, "bindingsTypes.ts"),
    types.replace(/declare const/g, "const"),
  );

  fs.writeFileSync(path.join(binariesOutputDir, "native.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, "wasm.d.ts"), typingsForCodegen);
  fs.writeFileSync(path.join(binariesOutputDir, `${binName}.d.ts`), typingsForCodegen);

  console.log("Done");
}

main().catch(console.error);
