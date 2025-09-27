import {default as initWASM} from './initWASM.js';
import {default as initWASMInterface} from './initInterface.js';

declare let dpp

async function initModule() {
  const wasm = await initWASM();
  const wasmInterface = await initWASMInterface();

  dpp = wasmInterface.initSync(wasm)

  return wasmInterface
}

export default initModule;
export {dpp};
