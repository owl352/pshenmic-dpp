import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Transfers tokens inside the token shielded pool, paying the fee from the credit shielded pool **/
export class TokenShieldedTransferWithShieldedFeeTransitionWASM {
    /** @private **/
    _rawTokenShieldedTransferWithShieldedFeeTransition;
    constructor(dataContractId, tokenContractPosition, tokenId, tokenActions, tokenAnchor, tokenProof, tokenBindingSignature, feeActions, feeAnchor, feeProof, feeBindingSignature, creditAmount) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition = new dppProvider.dpp.TokenShieldedTransferWithShieldedFeeTransitionNAPI(prepareIdentifierValue(dataContractId), tokenContractPosition, prepareIdentifierValue(tokenId), tokenActions.map(a => a._rawSerializedAction), tokenAnchor, tokenProof, tokenBindingSignature, feeActions.map(a => a._rawSerializedAction), feeAnchor, feeProof, feeBindingSignature, creditAmount.toString());
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value);
    }
    get tokenContractPosition() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition;
    }
    set tokenContractPosition(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition = value;
    }
    get tokenId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId);
    }
    set tokenId(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value);
    }
    get tokenActions() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set tokenActions(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction);
    }
    get tokenAnchor() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor;
    }
    set tokenAnchor(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor = value;
    }
    get tokenProof() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof;
    }
    set tokenProof(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof = value;
    }
    get tokenBindingSignature() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature;
    }
    set tokenBindingSignature(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature = value;
    }
    get feeActions() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set feeActions(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction);
    }
    get feeAnchor() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor;
    }
    set feeAnchor(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor = value;
    }
    get feeProof() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof;
    }
    set feeProof(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof = value;
    }
    get feeBindingSignature() {
        return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature;
    }
    set feeBindingSignature(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature = value;
    }
    get creditAmount() {
        return BigInt(this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount);
    }
    set creditAmount(value) {
        this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount = value.toString();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return TokenShieldedTransferWithShieldedFeeTransitionWASM.createFromRawInstance(dppProvider.dpp.TokenShieldedTransferWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenShieldedTransferWithShieldedFeeTransitionWASM.prototype);
        instance._rawTokenShieldedTransferWithShieldedFeeTransition = rawInstance;
        return instance;
    }
}
