import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityTopUpTransitionWASM {
    /** @private **/
    _rawIdentityTopUpTransition;
    constructor(assetLockProof, identityId, userFeeIncrease) {
        this._rawIdentityTopUpTransition = new dppProvider.dpp.IdentityTopUpTransitionNAPI(assetLockProof._rawAssetLockProof, prepareIdentifierValue(identityId), userFeeIncrease);
    }
    get userFeeIncrease() {
        return this._rawIdentityTopUpTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityTopUpTransition.userFeeIncrease = value;
    }
    get identityIdentifier() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityTopUpTransition.identityIdentifier);
    }
    set identityIdentifier(id) {
        this._rawIdentityTopUpTransition.identityIdentifier = prepareIdentifierValue(id);
    }
    get assetLockProof() {
        return AssetLockProofWASM.createFromRawInstance(this._rawIdentityTopUpTransition.assetLockProof);
    }
    set assetLockProof(value) {
        this._rawIdentityTopUpTransition.assetLockProof = value._rawAssetLockProof;
    }
    get signature() {
        return this._rawIdentityTopUpTransition.signature;
    }
    set signature(value) {
        this._rawIdentityTopUpTransition.signature = value;
    }
    getSignableBytes() {
        return this._rawIdentityTopUpTransition.getSignableBytes();
    }
    getModifiedDataIds() {
        return this._rawIdentityTopUpTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance);
    }
    getOptionalAssetLockProof() {
        const lock = this._rawIdentityTopUpTransition.getOptionalAssetLockProof();
        return (lock != null) ? AssetLockProofWASM.createFromRawInstance(lock) : undefined;
    }
    bytes() {
        return this._rawIdentityTopUpTransition.bytes();
    }
    hex() {
        return this._rawIdentityTopUpTransition.hex();
    }
    base64() {
        return this._rawIdentityTopUpTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityTopUpTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityTopUpTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityTopUpTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityTopUpTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityTopUpTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityTopUpTransitionWASM.prototype);
        instance._rawIdentityTopUpTransition = rawInstance;
        return instance;
    }
}
