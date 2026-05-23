const { WASI } = require('@tybys/wasm-util');
const { getDefaultContext } = require('@emnapi/runtime');
const { instantiateNapiModuleSync } = require('@emnapi/core');
const { bytes } = require('./wasm/wasmBytes.cjs');
const { decode } = require('../utils/base122.cjs');
const { decompressSync } = require('fflate');

const wasmBytes = new Uint8Array(decode(bytes));

const wasi = new WASI({
  version: 'preview1',
  print: function () {
    console.log.apply(console, arguments);
  },
  printErr: function () {
    console.error.apply(console, arguments);
  }
});

const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;

const __sharedMemory = new WebAssembly.Memory({
  initial: 1000,
  maximum: 2000,
  shared: true
});

const wasm = instantiateNapiModuleSync(decompressSync(wasmBytes), {
  context: emnapiContext,
  wasi,
  overwriteImports(importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi,
      memory: __sharedMemory
    };
  },
  beforeInit({ instance }) {
    for (const name of Object.keys(instance.exports)) {
      if (name.startsWith('__napi_register__')) {
        instance.exports[name]();
      }
    }
  }
});

module.exports = wasm.napiModule.exports;
module.exports.default = wasm.napiModule.exports;
