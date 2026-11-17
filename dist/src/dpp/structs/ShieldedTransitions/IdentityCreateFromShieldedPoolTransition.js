import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { IdentifierWASM } from '../Identifier.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, preparePlatformAddressValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreateFromShieldedPoolTransitionWASM {
    /** @private **/
    _rawIdentityCreateFromShieldedPoolTransition;
    constructor(publicKeys, denomination, actions, anchor, proof, bindingsSignature, sendToAddressOnCreationFailure, identityId) {
        this._rawIdentityCreateFromShieldedPoolTransition = new dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI(publicKeys.map(k => k._rawKeyInCreation), denomination.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingsSignature, preparePlatformAddressValue(sendToAddressOnCreationFailure), prepareIdentifierValue(identityId));
    }
    get publicKeys() {
        return this._rawIdentityCreateFromShieldedPoolTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance);
    }
    set publicKeys(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.publicKeys = value.map(k => k._rawKeyInCreation);
    }
    get denomination() {
        return BigInt(this._rawIdentityCreateFromShieldedPoolTransition.denomination);
    }
    set denomination(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.denomination = value.toString();
    }
    get actions() {
        return this._rawIdentityCreateFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get anchor() {
        return this._rawIdentityCreateFromShieldedPoolTransition.anchor;
    }
    set anchor(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.anchor = value;
    }
    get proof() {
        return this._rawIdentityCreateFromShieldedPoolTransition.proof;
    }
    set proof(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature = value;
    }
    get sendToAddressOnCreationFailure() {
        return PlatformAddressWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure);
    }
    set sendToAddressOnCreationFailure(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure = preparePlatformAddressValue(value);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.identityId);
    }
    set identityId(value) {
        this._rawIdentityCreateFromShieldedPoolTransition.identityId = prepareIdentifierValue(value);
    }
    static computeMinimumFee(numActions, numKeys, platformVersion) {
        return BigInt(dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(numActions, numKeys, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return IdentityCreateFromShieldedPoolTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreateFromShieldedPoolTransitionWASM.prototype);
        instance._rawIdentityCreateFromShieldedPoolTransition = rawInstance;
        return instance;
    }
}
