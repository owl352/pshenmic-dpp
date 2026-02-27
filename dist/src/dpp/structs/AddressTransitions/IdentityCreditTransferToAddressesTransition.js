import { OutputAddressWASM } from './entities/OutputAddress.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreditTransferToAddressesTransitionWASM {
    /** @private **/
    _rawIdentityCreditTransferToAddressesTransition;
    constructor(identifier, recipients, nonce, userFeeIncrease) {
        this._rawIdentityCreditTransferToAddressesTransition = new dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI(prepareIdentifierValue(identifier), recipients.map(r => r._rawOutputAddress), nonce.toString(), userFeeIncrease);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransferToAddressesTransition.identityId);
    }
    set identityId(id) {
        this._rawIdentityCreditTransferToAddressesTransition.identityId = prepareIdentifierValue(id);
    }
    get recipientAddresses() {
        return this._rawIdentityCreditTransferToAddressesTransition.recipientAddresses.map(OutputAddressWASM.createFromRawInstance);
    }
    set recipientAddresses(value) {
        this._rawIdentityCreditTransferToAddressesTransition.recipientAddresses = value.map(r => r._rawOutputAddress);
    }
    get nonce() {
        return BigInt(this._rawIdentityCreditTransferToAddressesTransition.nonce);
    }
    set nonce(value) {
        this._rawIdentityCreditTransferToAddressesTransition.nonce = value.toString();
    }
    get userFeeIncrease() {
        return this._rawIdentityCreditTransferToAddressesTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityCreditTransferToAddressesTransition.userFeeIncrease = value;
    }
    get signaturePublicKeyId() {
        return this._rawIdentityCreditTransferToAddressesTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawIdentityCreditTransferToAddressesTransition.signaturePublicKeyId = value;
    }
    get signature() {
        return this._rawIdentityCreditTransferToAddressesTransition.signature;
    }
    set signature(sig) {
        this._rawIdentityCreditTransferToAddressesTransition.signature = sig;
    }
    bytes() {
        return this._rawIdentityCreditTransferToAddressesTransition.bytes();
    }
    hex() {
        return this._rawIdentityCreditTransferToAddressesTransition.hex();
    }
    base64() {
        return this._rawIdentityCreditTransferToAddressesTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreditTransferToAddressesTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreditTransferToAddressesTransitionWASM.prototype);
        instance._rawIdentityCreditTransferToAddressesTransition = rawInstance;
        return instance;
    }
}
