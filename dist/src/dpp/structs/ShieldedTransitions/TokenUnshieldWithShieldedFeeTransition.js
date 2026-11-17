import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Unshields tokens to an identity, paying the fee from the credit shielded pool **/
export class TokenUnshieldWithShieldedFeeTransitionWASM {
    /** @private **/
    _rawTokenUnshieldWithShieldedFeeTransition;
    constructor(dataContractId, tokenContractPosition, tokenId, recipientId, amount, tokenActions, tokenAnchor, tokenProof, tokenBindingSignature, feeActions, feeAnchor, feeProof, feeBindingSignature, creditAmount) {
        this._rawTokenUnshieldWithShieldedFeeTransition = new dppProvider.dpp.TokenUnshieldWithShieldedFeeTransitionNAPI(prepareIdentifierValue(dataContractId), tokenContractPosition, prepareIdentifierValue(tokenId), prepareIdentifierValue(recipientId), amount.toString(), tokenActions.map(a => a._rawSerializedAction), tokenAnchor, tokenProof, tokenBindingSignature, feeActions.map(a => a._rawSerializedAction), feeAnchor, feeProof, feeBindingSignature, creditAmount.toString());
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value);
    }
    get tokenContractPosition() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition;
    }
    set tokenContractPosition(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition = value;
    }
    get tokenId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.tokenId);
    }
    set tokenId(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value);
    }
    get recipientId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.recipientId);
    }
    set recipientId(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.recipientId = prepareIdentifierValue(value);
    }
    get amount() {
        return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.amount);
    }
    set amount(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.amount = value.toString();
    }
    get tokenActions() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set tokenActions(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction);
    }
    get tokenAnchor() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor;
    }
    set tokenAnchor(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor = value;
    }
    get tokenProof() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof;
    }
    set tokenProof(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof = value;
    }
    get tokenBindingSignature() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature;
    }
    set tokenBindingSignature(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature = value;
    }
    get feeActions() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set feeActions(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction);
    }
    get feeAnchor() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor;
    }
    set feeAnchor(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor = value;
    }
    get feeProof() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.feeProof;
    }
    set feeProof(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.feeProof = value;
    }
    get feeBindingSignature() {
        return this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature;
    }
    set feeBindingSignature(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature = value;
    }
    get creditAmount() {
        return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount);
    }
    set creditAmount(value) {
        this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount = value.toString();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return TokenUnshieldWithShieldedFeeTransitionWASM.createFromRawInstance(dppProvider.dpp.TokenUnshieldWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenUnshieldWithShieldedFeeTransitionWASM.prototype);
        instance._rawTokenUnshieldWithShieldedFeeTransition = rawInstance;
        return instance;
    }
}
