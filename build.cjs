const path = require('node:path')
const toml = require('toml')
const { exec } = require('child_process')
const { promisify } = require('node:util')
const fs = require('fs')
const { convertBinary } = require('./utils/convertBinary.mjs')
const { getStructsForEsmExport } = require('./utils/getStructsForEsmExport.mjs')

const typingsForCodegen = 'export * from "./bindingsTypes.ts"'

// release/debug
const buildProfile = process.env.PROFILE ?? 'release'
const wasmOptScript = process.env.WASM_OPT_SCRIPT ?? path.join(__dirname, 'scripts/wasm-opt.sh')
const binariesOutputDir = process.env.BIN_OUTPUT_DIR ?? path.join(__dirname, 'pkg', 'binaries')
const templatesOutputDir = process.env.JS_OUTPUT_DIR ?? path.join(__dirname, 'pkg')

const emnapi = path.join(require.resolve('emnapi'), '..', 'lib', 'wasm32-wasi-threads')

const cargoTomlPath = path.join(__dirname, 'Cargo.toml')
const fileContent = fs.readFileSync(cargoTomlPath, 'utf8')
const { package: { name: rustCrateName } } = toml.parse(fileContent)

const binName = rustCrateName.replace('-', '_')

const targetWasmFile = path.join(__dirname, 'target', 'wasm32-wasip1-threads', buildProfile, `${binName}.wasm`)

const execTask = promisify(exec)

async function main () {
  console.log('Building wasm32-wasip1-threads')
  console.log('EMNAPI link:', emnapi)
  await execTask(`cargo build --target wasm32-wasip1-threads --${buildProfile}`, {
    env: {
      ...process.env,
      EMNAPI_LINK_DIR: emnapi
      // doesn't need when we use only binary
      // NAPI_TYPE_DEF_TMP_FOLDER:
    }
  })

  console.log('Building node-api by ferric')
  await execTask(`npm run ferric:build -- --configuration ${buildProfile} --output ${binariesOutputDir}`)

  console.log('Running wasm-opt')
  await execTask(wasmOptScript, {
    env: {
      ...process.env,
      OUTPUT_FILE: targetWasmFile.toString()
    }
  })

  console.log('Generate WASM output directory')
  const wasmOutputDir = path.join(binariesOutputDir, 'wasm')

  if (!fs.existsSync(wasmOutputDir)) {
    fs.mkdirSync(wasmOutputDir)
  }

  console.log('Generate zipped js base122 WASM output')
  await convertBinary(targetWasmFile, path.join(wasmOutputDir, 'wasmBytes.js'))

  console.log('Copying templates')
  fs.cpSync('./templates', templatesOutputDir, { recursive: true })

  console.log('Patch exports to ESM for node-api')
  const typesPath = path.join(binariesOutputDir, `${binName}.d.ts`)

  const exports = getStructsForEsmExport(typesPath.toString())

  fs.writeFileSync(path.join(binariesOutputDir, `${binName}.js`), [
    '/* eslint-disable */',
    'import {requireNodeAddon} from \'react-native-node-api\'',
    `export const { ${exports.join(', ')} } = requireNodeAddon('./${binName}.node')`
  ].join('\n\n') + '\n', 'utf8')

  console.log('Adding ESM export for WASM')
  const wasmInitScript = fs.readFileSync(path.join(binariesOutputDir, 'wasm.js'), { encoding: 'utf8' })

  fs.writeFileSync(path.join(binariesOutputDir, 'wasm.js'), wasmInitScript.replace('/* exports here */', `export const { ${exports.join(', ')} } =`))

  console.log('Patch typings')
  const types = fs.readFileSync(typesPath, { encoding: 'utf8' })

  fs.writeFileSync(path.join(binariesOutputDir, 'bindingsTypes.ts'), types.replace(/declare const/g, 'const'))

  fs.writeFileSync(path.join(binariesOutputDir, 'wasm.d.ts'), typingsForCodegen)
  fs.writeFileSync(path.join(binariesOutputDir, `${binName}.d.ts`), typingsForCodegen)

  console.log('Done')
}

main().catch(console.error)
