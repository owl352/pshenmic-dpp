import * as Identifier from './structs/Identifier.js';
import * as Identity from './structs/Identity.js';
import * as IdentityPublicKey from './structs/IdentityPublicKey.js';
export { IdentifierWASM } from './structs/Identifier.js';
export { IdentityWASM } from './structs/Identity.js';
export { IdentityPublicKeyWASM } from './structs/IdentityPublicKey.js';
export function setDpp(dpp) {
    Identifier.setDpp(dpp);
    Identity.setDpp(dpp);
    IdentityPublicKey.setDpp(dpp);
}
