import {default as wasmBytes} from './pshenmic_dpp_bg.js'
import {default as wasmInterfaceBytes} from './pshenmic_dpp.js'
import {decode} from './base122.js'

export * from './base122.js'

const isNode = () =>
  typeof process !== 'undefined' &&
  !!process.versions &&
  !!process.versions.node;

const interfaceBytes = new Uint8Array(decode(wasmInterfaceBytes));
const interfaceBlob = new Blob([interfaceBytes]);

async function main() {
  const decompressionStream = new DecompressionStream('gzip');
  const decompressedStream = interfaceBlob.stream().pipeThrough(decompressionStream);
  const decompressedResponse = new Response(decompressedStream);
  const moduleText = await decompressedResponse.text();

  if(isNode()) {
    const moduleUrl = 'data:text/javascript,' + encodeURIComponent(moduleText);

    const module = await import(moduleUrl);

    return module;
  } else {
    const blob = new Blob([moduleText], { type: 'application/javascript' });
    const moduleUrl = URL.createObjectURL(blob);

    const module = await import(moduleUrl);

    return module;
  }
}

export default main


// export * from './pshenmic_dpp.js'

// const bytes = new Uint8Array(decode(wasmBytes))
//
// const dppInstance = DPP.initSync({module: decompressSync(bytes)})
//
// export default DPP
