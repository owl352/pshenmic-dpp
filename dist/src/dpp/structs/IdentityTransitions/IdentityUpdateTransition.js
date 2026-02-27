import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityUpdateTransitionWASM {
    /** @private **/
    _rawIdentityUpdateTransition;
    constructor(identityId, revision, nonce, addPublicKeys, disablePublicKeys, userFeeIncrease) {
        this._rawIdentityUpdateTransition = new dppProvider.dpp.IdentityUpdateTransitionNAPI(prepareIdentifierValue(identityId), revision.toString(), nonce.toString(), addPublicKeys.map(key => key._rawKeyInCreation), disablePublicKeys, userFeeIncrease);
    }
    get revision() {
        return BigInt(this._rawIdentityUpdateTransition.revision);
    }
    set revision(value) {
        this._rawIdentityUpdateTransition.revision = value.toString();
    }
    get nonce() {
        return BigInt(this._rawIdentityUpdateTransition.nonce);
    }
    set nonce(value) {
        this._rawIdentityUpdateTransition.nonce = value.toString();
    }
    get identityIdentifier() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityUpdateTransition.identityIdentifier);
    }
    set identityIdentifier(value) {
        this._rawIdentityUpdateTransition.identityIdentifier = prepareIdentifierValue(value);
    }
    get publicKeyIdsToDisable() {
        return this._rawIdentityUpdateTransition.publicKeyIdsToDisable;
    }
    set publicKeyIdsToDisable(value) {
        this._rawIdentityUpdateTransition.publicKeyIdsToDisable = value;
    }
    get publicKeyIdsToAdd() {
        return this._rawIdentityUpdateTransition.publicKeyIdsToAdd.map(IdentityPublicKeyInCreationWASM.createFromRawInstance);
    }
    set publicKeyIdsToAdd(value) {
        this._rawIdentityUpdateTransition.publicKeyIdsToAdd = value.map(key => key._rawKeyInCreation);
    }
    get userFeeIncrease() {
        return this._rawIdentityUpdateTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityUpdateTransition.userFeeIncrease = value;
    }
    get signature() {
        return this._rawIdentityUpdateTransition.signature;
    }
    set signature(value) {
        this._rawIdentityUpdateTransition.signature = value;
    }
    get signaturePublicKeyId() {
        return this._rawIdentityUpdateTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawIdentityUpdateTransition.signaturePublicKeyId = value;
    }
    getSignableBytes() {
        return this._rawIdentityUpdateTransition.getSignableBytes();
    }
    getPurposeRequirement() {
        return this._rawIdentityUpdateTransition.getPurposeRequirement();
    }
    getModifiedDataIds() {
        return this._rawIdentityUpdateTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance);
    }
    getOptionalAssetLockProof() {
        const lock = this._rawIdentityUpdateTransition.getOptionalAssetLockProof();
        if (lock != null) {
            return AssetLockProofWASM.createFromRawInstance(lock);
        }
        else {
            return undefined;
        }
    }
    bytes() {
        return this._rawIdentityUpdateTransition.bytes();
    }
    hex() {
        return this._rawIdentityUpdateTransition.hex();
    }
    base64() {
        return this._rawIdentityUpdateTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityUpdateTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityUpdateTransitionWASM.prototype);
        instance._rawIdentityUpdateTransition = rawInstance;
        return instance;
    }
}
