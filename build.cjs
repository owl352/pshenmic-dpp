const path = require('node:path')
const toml = require('toml')
const {exec} = require('child_process')
const { promisify } = require('node:util');
const fs = require('fs')

// release/debug
const buildProfile = 'release'

const emnapi = path.join(require.resolve("emnapi"), "..", "lib", "wasm32-wasi-threads")

const cargoTomlPath = path.join(__dirname, 'Cargo.toml')
const fileContent = fs.readFileSync(cargoTomlPath, 'utf8')
const {package: {name: rustCrateName}} = toml.parse(fileContent)

const targetWasmDir = path.join(__dirname, 'target', 'wasm32-wasip1-threads', buildProfile, `${rustCrateName}.wasm`)
const outputDir = path.join(__dirname, 'pkg')

const execTask = promisify(exec)

async function main() {
  console.log(`Building wasm32-wasip1`)
  await execTask(`cargo build --target wasm32-wasip1-threads --${buildProfile}`, {
    env: {
      ...process.env,
      EMNAPI_LINK_DIR: emnapi
      // doesn't need when we use only binary
      // NAPI_TYPE_DEF_TMP_FOLDER:
    }
  })

  console.log(`Building node-api by ferric`)
  await execTask(`npm run ferric:build -- --configuration ${buildProfile} --output ${outputDir}`)

  console.log(`Running wasm-opt`)

  await execTask("wasm-opt", [
    "--code-folding",
    "--const-hoisting",
    "--abstract-type-refining",
    "--dce",
    "--strip-producers",
    "-Oz",
    "--generate-global-effects",
    "--enable-bulk-memory",
    "--enable-nontrapping-float-to-int",
    "-tnh",
    "--flatten",
    "--rereloop",
    "-Oz",
    "--converge",
    "--vacuum",
    "--dce",
    "--gsi",
    "--inlining-optimizing",
    "--merge-blocks",
    "--simplify-locals",
    "--optimize-added-constants",
    "--optimize-casts",
    "--optimize-instructions",
    "--optimize-stack-ir",
    "--remove-unused-brs",
    "--remove-unused-module-elements",
    "--remove-unused-names",
    "--remove-unused-types",
    "--gufa",
    "--once-reduction",
    "-Oz",
    "-Oz",
    targetWasmDir.toString(),
    "-o",
    targetWasmDir.toString(),
  ]);

  console.log(`Generate wasm output`)
  const wasmOutputDir = path.join(outputDir, 'wasm')

  if(!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir)
  }

  const wasmBytes = fs.readFileSync(targetWasmDir)

  fs.writeFileSync(path.join(wasmOutputDir, 'wasmBytes.js'), `export default "${wasmBytes.toString('base64')}"`)

  fs.copyFileSync('./templates/wasm.js', path.join(outputDir, 'wasm.js'))
  fs.copyFileSync(path.join(outputDir, `${rustCrateName}.d.ts`), path.join(outputDir, 'wasm.d.ts'))

  console.log(`Done ✨`)
}

main().catch(console.error);
