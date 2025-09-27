import {default as wasmInterfaceBytes} from './pshenmic_dpp_zipped.js';
import {decode} from './base122.js';

export * from './base122.js';

let modulePromise;

const isNode = () =>
  typeof process !== 'undefined' &&
  !!process.versions &&
  !!process.versions.node;

const interfaceBytes = new Uint8Array(decode(wasmInterfaceBytes));
const interfaceBlob = new Blob([interfaceBytes]);

async function initInterface() {
  const decompressionStream = new DecompressionStream('gzip');
  const decompressedStream = interfaceBlob.stream().pipeThrough(decompressionStream);
  const decompressedResponse = new Response(decompressedStream);
  const moduleText = await decompressedResponse.text();

  let module;
  if (isNode()) {
    const vm = await import('vm');

    const context = vm.createContext({
      crypto,
      TextDecoder,
    });
    const vmModule = new vm.Script(moduleText);

    vmModule.runInContext(context);

    module = context['pshenmic-dpp']
  } else {
    const blob = new Blob([moduleText], {type: 'application/javascript'});
    const moduleUrl = URL.createObjectURL(blob);

    module = await import(moduleUrl);

    URL.revokeObjectURL(moduleUrl);
  }

  return module;
}

export default initInterface;
