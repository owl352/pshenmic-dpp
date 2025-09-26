import {default as wasmBytes} from './pshenmic_dpp_bg.js'
import {default as wasmInterfaceBytes} from './pshenmic_dpp.js'
import {decode} from './base122.js'

export * from './base122.js'

console.log()

// export * from './pshenmic_dpp.js'

// const bytes = new Uint8Array(decode(wasmBytes))
//
// const dppInstance = DPP.initSync({module: decompressSync(bytes)})
//
// export default DPP
