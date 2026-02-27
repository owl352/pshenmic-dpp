import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreateTransitionWASM {
    /** @private **/
    _rawIdentityCreateTransition;
    constructor(publicKeys, assetLockProof, signature, userFeeIncrease) {
        this._rawIdentityCreateTransition = new dppProvider.dpp.IdentityCreateTransitionNAPI(publicKeys.map(publicKey => publicKey._rawKeyInCreation), assetLockProof._rawAssetLockProof, signature, userFeeIncrease);
    }
    get publicKeys() {
        return this._rawIdentityCreateTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance);
    }
    set publicKeys(publicKeys) {
        this._rawIdentityCreateTransition.publicKeys = publicKeys.map(publicKey => publicKey._rawKeyInCreation);
    }
    get userFeeIncrease() {
        return this._rawIdentityCreateTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityCreateTransition.userFeeIncrease = value;
    }
    get signature() {
        return this._rawIdentityCreateTransition.signature;
    }
    set signature(value) {
        this._rawIdentityCreateTransition.signature = value;
    }
    get assetLock() {
        return AssetLockProofWASM.createFromRawInstance(this._rawIdentityCreateTransition.assetLock);
    }
    set assetLock(value) {
        this._rawIdentityCreateTransition.assetLock = value._rawAssetLockProof;
    }
    getSignableBytes() {
        return this._rawIdentityCreateTransition.getSignableBytes();
    }
    getIdentifier() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreateTransition.getIdentifier());
    }
    bytes() {
        return this._rawIdentityCreateTransition.bytes();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreateTransition.toStateTransition());
    }
    static default(platformVersion) {
        return IdentityCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateTransitionNAPI.default(valueToDynamicValue(platformVersion)));
    }
    static fromHex(hex) {
        return IdentityCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateTransitionNAPI.fromBase64(base64));
    }
    static fromBytes(bytes) {
        return IdentityCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateTransitionNAPI.fromBytes(bytes));
    }
    static fromStateTransition(stateTransition) {
        return IdentityCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreateTransitionWASM.prototype);
        instance._rawIdentityCreateTransition = rawInstance;
        return instance;
    }
}
