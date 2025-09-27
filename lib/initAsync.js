import initWASM from './initWASM.js'
import initWASMInterface from './initInterface.js'

// eslint-disable-next-line
let dpp

/**
 * Asynchronously initialization for compressed module (reduced size)
 * @returns {Promise<*>}
 */
async function initModule () {
  const wasm = await initWASM()
  const wasmInterface = await initWASMInterface()

  dpp = wasmInterface.initSync(wasm)

  return wasmInterface
}

export default initModule
