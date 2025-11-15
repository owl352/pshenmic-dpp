import {WASI} from "@tybys/wasm-util"
import {getDefaultContext} from "@emnapi/runtime"
import {instantiateNapiModuleSync} from "@emnapi/core"
import wasmBytes from './binaries/wasm/wasmBytes.js'
import {decode} from "../../utils/base122.mjs";
import {decompressSync} from "fflate";

const bytes = new Uint8Array(decode(wasmBytes))

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

const wasm = instantiateNapiModuleSync(decompressSync(bytes), {
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
  beforeInit({instance}) {
    for (const name of Object.keys(instance.exports)) {
      if (name.startsWith('__napi_register__')) {
        instance.exports[name]()
      }
    }
  },
})

/* exports here */ wasm.napiModule.exports
