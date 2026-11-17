import { IdentifierWASM } from '../Identifier.js';
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js';
/**
 * Result of `identityCreateFromShieldedPool`: the new identity's keys (with
 * proof-of-possession signatures), the proven Orchard bundle fields, the derived
 * identity id, and the client-predicted fee.
 */
export class IdentityCreateFromShieldedPoolResultWASM {
    /** @private **/
    _rawIdentityCreateFromShieldedPoolResult;
    get publicKeys() {
        return this._rawIdentityCreateFromShieldedPoolResult.publicKeys.map(IdentityPublicKeyInCreationWASM.fromBytes);
    }
    get identityId() {
        return IdentifierWASM.fromBytes(this._rawIdentityCreateFromShieldedPoolResult.identityId);
    }
    get predictedFee() {
        return BigInt(this._rawIdentityCreateFromShieldedPoolResult.predictedFee);
    }
    get actions() {
        return this._rawIdentityCreateFromShieldedPoolResult.actions.map(SerializedActionWASM.fromBytes);
    }
    get anchor() {
        return this._rawIdentityCreateFromShieldedPoolResult.anchor;
    }
    get proof() {
        return this._rawIdentityCreateFromShieldedPoolResult.proof;
    }
    get bindingsSignature() {
        return this._rawIdentityCreateFromShieldedPoolResult.bindingsSignature;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreateFromShieldedPoolResultWASM.prototype);
        instance._rawIdentityCreateFromShieldedPoolResult = rawInstance;
        return instance;
    }
}
