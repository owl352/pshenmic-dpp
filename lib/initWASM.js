import {default as wasmBytes} from './pshenmic_dpp_bg.js';
import {decode} from './base122.js';

export * from './base122.js';

let modulePromise;

const isNode = () =>
  typeof process !== 'undefined' &&
  !!process.versions &&
  !!process.versions.node;

const interfaceBytes = new Uint8Array(decode(wasmBytes));
const interfaceBlob = new Blob([interfaceBytes]);

async function initWASM() {
  const decompressionStream = new DecompressionStream('gzip');
  const decompressedStream = interfaceBlob.stream().pipeThrough(decompressionStream);
  const decompressedResponse = new Response(decompressedStream);
  const module = await decompressedResponse.arrayBuffer();

  return module;
}

export default initWASM;
