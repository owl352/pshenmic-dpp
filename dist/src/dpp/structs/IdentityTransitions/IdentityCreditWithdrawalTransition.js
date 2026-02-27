import { dppProvider } from '../../provider.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreditWithdrawalTransitionWASM {
    /** @private **/
    _rawIdentityCreditWithdrawalTransition;
    constructor(identityId, amount, coreFeePerByte, pooling, nonce, outputScript, userFeeIncrease) {
        this._rawIdentityCreditWithdrawalTransition = new dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI(prepareIdentifierValue(identityId), amount.toString(), coreFeePerByte, valueToDynamicValue(pooling), nonce.toString(), outputScript?._rawCoreScript, userFeeIncrease);
    }
    get outputScript() {
        const script = this._rawIdentityCreditWithdrawalTransition.outputScript;
        if (script != null) {
            return CoreScriptWASM.createFromRawInstance(script);
        }
    }
    set outputScript(script) {
        this._rawIdentityCreditWithdrawalTransition.outputScript = script?._rawCoreScript;
    }
    get pooling() {
        return this._rawIdentityCreditWithdrawalTransition.pooling;
    }
    set pooling(value) {
        this._rawIdentityCreditWithdrawalTransition.pooling = valueToDynamicValue(value);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditWithdrawalTransition.identityId);
    }
    set identityId(value) {
        this._rawIdentityCreditWithdrawalTransition.identityId = prepareIdentifierValue(value);
    }
    get userFeeIncrease() {
        return this._rawIdentityCreditWithdrawalTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityCreditWithdrawalTransition.userFeeIncrease = value;
    }
    get nonce() {
        return BigInt(this._rawIdentityCreditWithdrawalTransition.nonce);
    }
    set nonce(value) {
        this._rawIdentityCreditWithdrawalTransition.nonce = value.toString();
    }
    get amount() {
        return BigInt(this._rawIdentityCreditWithdrawalTransition.amount);
    }
    set amount(value) {
        this._rawIdentityCreditWithdrawalTransition.amount = value.toString();
    }
    get coreFeePerByte() {
        return this._rawIdentityCreditWithdrawalTransition.coreFeePerByte;
    }
    set coreFeePerByte(value) {
        this._rawIdentityCreditWithdrawalTransition.coreFeePerByte = value;
    }
    get signature() {
        return this._rawIdentityCreditWithdrawalTransition.signature;
    }
    set signature(value) {
        this._rawIdentityCreditWithdrawalTransition.signature = value;
    }
    get signaturePublicKeyId() {
        return this._rawIdentityCreditWithdrawalTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawIdentityCreditWithdrawalTransition.signaturePublicKeyId = value;
    }
    getSignableBytes() {
        return this._rawIdentityCreditWithdrawalTransition.getSignableBytes();
    }
    getPurposeRequirement() {
        return this._rawIdentityCreditWithdrawalTransition.getPurposeRequirement();
    }
    getModifiedDataIds() {
        return this._rawIdentityCreditWithdrawalTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance);
    }
    getOptionalAssetLockProof() {
        const lock = this._rawIdentityCreditWithdrawalTransition.getOptionalAssetLockProof();
        if (lock != null) {
            return AssetLockProofWASM.createFromRawInstance(lock);
        }
    }
    bytes() {
        return this._rawIdentityCreditWithdrawalTransition.bytes();
    }
    hex() {
        return this._rawIdentityCreditWithdrawalTransition.hex();
    }
    base64() {
        return this._rawIdentityCreditWithdrawalTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreditWithdrawalTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreditWithdrawalTransitionWASM.prototype);
        instance._rawIdentityCreditWithdrawalTransition = rawInstance;
        return instance;
    }
}
