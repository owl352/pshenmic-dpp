import { WASI } from "@tybys/wasm-util"
import { getDefaultContext } from "@emnapi/runtime"
import { instantiateNapiModuleSync } from "@emnapi/core"
import wasmBase64Bytes from './wasm/wasmBytes.js'

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const wasmBytes = base64ToArrayBuffer(wasmBase64Bytes);

const wasi = new WASI({
  version: 'preview1',
  print: function () {
    console.log.apply(console, arguments)
  },
  printErr: function () {
    console.error.apply(console, arguments)
  },
})

const emnapiContext = getDefaultContext()

const __sharedMemory = new WebAssembly.Memory({
  "initial": 4000,
  "maximum": 6000,
  "shared": true,
})

const wasm = instantiateNapiModuleSync(wasmBytes, {
  context: emnapiContext,
  wasi,
  overwriteImports(importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi,
      memory: __sharedMemory,
    }
  },
  beforeInit({ instance }) {
    for (const name of Object.keys(instance.exports)) {
      if (name.startsWith('__napi_register__')) {
        instance.exports[name]()
      }
    }
  },
})

export const { IdentifierWASM, KeyType, NetworkWASM, PlatformVersionWASM, PurposeWASM, SecurityLevelWASM, IdentityPublicKeyWASM, IdentityWASM } = wasm.napiModule.exports;