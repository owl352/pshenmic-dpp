import * as DPP from './pshenmic_dpp.js'
import {default as wasmBytes} from './pshenmic_dpp_bg.js'
import {decode} from './base122.js'
import {decompressSync} from "fflate"

export * from './base122.js'
export * from './pshenmic_dpp.js'

const bytes = new Uint8Array(decode(wasmBytes))

const dppInstance = DPP.initSync({module: decompressSync(bytes)})

export default DPP
