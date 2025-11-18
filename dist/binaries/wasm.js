import { WASI } from '@tybys/wasm-util';
import { getDefaultContext } from '@emnapi/runtime';
import { instantiateNapiModuleSync } from '@emnapi/core';
import { bytes } from './wasm/wasmBytes.js';
import { decode } from '../utils/base122.js';
import { decompressSync } from 'fflate';
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
export const { IdentifierNAPI, IdentityNAPI, IdentityPublicKeyNAPI, KeyTypeNAPI, NetworkNAPI, PlatformVersionNAPI, PurposeNAPI, SecurityLevelNAPI } = wasm.napiModule.exports;
