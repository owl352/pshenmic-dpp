import {initWASM} from './initWASM.js'
import {initInterface} from './initInterface.js'

// eslint-disable-next-line
let dpp

/**
 * Asynchronously initialization for compressed module (reduced size)
 * @returns {Promise<*>}
 */
async function initModule() {
  const wasm = await initWASM()
  const wasmInterface = await initInterface()

  dpp = wasmInterface.initSync(wasm)

  return wasmInterface
}

export {initModule}
