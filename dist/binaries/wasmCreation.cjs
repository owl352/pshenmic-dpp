"use strict";
// BASE (non-threaded) wasm creation — sync at import, non-shared memory, no
// workers, no reuseWorker. Loads WITHOUT cross-origin isolation /
// SharedArrayBuffer (dash-platform-extension#219): data classes only, the
// proving feature is compiled out (--no-default-features). The threaded
// proving module lives in shieldedCreation.cjs and is provided by the consumer
// via setShielded(shielded) (or dash-platform-shielded/lazy + loadShielded()).
const { WASI } = require('@tybys/wasm-util');
const { getDefaultContext } = require('@emnapi/runtime');
const { instantiateNapiModuleSync } = require('@emnapi/core');
const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;
const { bytes } = require('./wasm/baseBytes.cjs');
const { decode } = require('../utils/base122.cjs');
const { decompressSync } = require('fflate');
const { default: memory } = require('./memory.cjs');
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
const wasm = instantiateNapiModuleSync(decompressSync(wasmBytes), {
    context: emnapiContext,
    wasi,
    overwriteImports(importObject) {
        importObject.env = {
            ...importObject.env,
            ...importObject.napi,
            ...importObject.emnapi,
            memory
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
