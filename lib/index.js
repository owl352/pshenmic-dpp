import * as DPP from './pshenmic_dpp.js';
import {default as wasmBytes} from "./pshenmic_dpp_bg.js";

export * from './pshenmic_dpp.js'

const binaryString = atob(wasmBytes);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
}

const dppInstance = DPP.initSync({ module: bytes.buffer });

export default DPP;
