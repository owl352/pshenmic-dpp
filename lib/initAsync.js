import {default as initWASM} from './initWASM.js';
import {default as initWASMInterface} from './initInterface.js';

let dpp

/**
 * Asynchronously initialization for compressed module (reduced size)
 * @returns {Promise<*>}
 */
async function initModule() {
  const wasm = await initWASM();
  const wasmInterface = await initWASMInterface();

  dpp = wasmInterface.initSync(wasm)

  return wasmInterface
}

export default initModule;
