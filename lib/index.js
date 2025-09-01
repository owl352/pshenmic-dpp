import * as DPP from './pshenmic_dpp.js';
import {default as wasmBytes} from "./pshenmic_dpp_bg.js";
import {decodeBase122} from "./base122.js";

export * from './base122.js'
export * from './pshenmic_dpp.js'

const bytes = new Uint8Array(decodeBase122(wasmBytes))

const dppInstance = DPP.initSync({ module: bytes });

export default DPP;
