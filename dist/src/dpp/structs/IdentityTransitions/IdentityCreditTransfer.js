import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreditTransferWASM {
    /** @private **/
    _rawIdentityCreditTransfer;
    constructor(sender, amount, recipient, nonce, userFeeIncrease) {
        this._rawIdentityCreditTransfer = new dppProvider.dpp.IdentityCreditTransferNAPI(prepareIdentifierValue(sender), amount.toString(), prepareIdentifierValue(recipient), nonce.toString(), userFeeIncrease);
    }
    get recipientId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransfer.recipientId);
    }
    set recipientId(value) {
        this._rawIdentityCreditTransfer.recipientId = prepareIdentifierValue(value);
    }
    get senderId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransfer.senderId);
    }
    set senderId(value) {
        this._rawIdentityCreditTransfer.recipientId = prepareIdentifierValue(value);
    }
    get amount() {
        return BigInt(this._rawIdentityCreditTransfer.amount);
    }
    set amount(value) {
        this._rawIdentityCreditTransfer.amount = value.toString();
    }
    get nonce() {
        return BigInt(this._rawIdentityCreditTransfer.nonce);
    }
    set nonce(value) {
        this._rawIdentityCreditTransfer.nonce = value.toString();
    }
    get signature() {
        return this._rawIdentityCreditTransfer.signature;
    }
    set signature(value) {
        this._rawIdentityCreditTransfer.signature = value;
    }
    get signaturePublicKeyId() {
        return this._rawIdentityCreditTransfer.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawIdentityCreditTransfer.signaturePublicKeyId = value;
    }
    get userFeeIncrease() {
        return this._rawIdentityCreditTransfer.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityCreditTransfer.userFeeIncrease = value;
    }
    getSignableBytes() {
        return this._rawIdentityCreditTransfer.getSignableBytes();
    }
    bytes() {
        return this._rawIdentityCreditTransfer.bytes();
    }
    hex() {
        return this._rawIdentityCreditTransfer.hex();
    }
    base64() {
        return this._rawIdentityCreditTransfer.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreditTransfer.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityCreditTransferWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityCreditTransferWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityCreditTransferWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityCreditTransferWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreditTransferWASM.prototype);
        instance._rawIdentityCreditTransfer = rawInstance;
        return instance;
    }
}
