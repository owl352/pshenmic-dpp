import * as protocol from '../binaries/pshenmic_dpp.js';
import {setDpp} from "./dpp/dpp.js";

setDpp(protocol)

export {KeyType, Purpose, PlatformVersionWASM, NetworkWASM, SecurityLevel} from "./enums.js"
export * from './types.js'
export {IdentityWASM, IdentifierWASM, IdentityPublicKeyWASM} from "./dpp/dpp.js"
