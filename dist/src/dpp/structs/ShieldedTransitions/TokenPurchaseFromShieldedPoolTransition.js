import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Buys tokens at their direct purchase price with credits from the shielded pool **/
export class TokenPurchaseFromShieldedPoolTransitionWASM {
    /** @private **/
    _rawTokenPurchaseFromShieldedPoolTransition;
    constructor(dataContractId, tokenContractPosition, tokenId, tokenCount, totalAgreedPrice, tokenActions, tokenAnchor, tokenProof, tokenBindingSignature, feeActions, feeAnchor, feeProof, feeBindingSignature, creditAmount) {
        this._rawTokenPurchaseFromShieldedPoolTransition = new dppProvider.dpp.TokenPurchaseFromShieldedPoolTransitionNAPI(prepareIdentifierValue(dataContractId), tokenContractPosition, prepareIdentifierValue(tokenId), tokenCount.toString(), totalAgreedPrice.toString(), tokenActions.map(a => a._rawSerializedAction), tokenAnchor, tokenProof, tokenBindingSignature, feeActions.map(a => a._rawSerializedAction), feeAnchor, feeProof, feeBindingSignature, creditAmount.toString());
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId = prepareIdentifierValue(value);
    }
    get tokenContractPosition() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition;
    }
    set tokenContractPosition(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition = value;
    }
    get tokenId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.tokenId);
    }
    set tokenId(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenId = prepareIdentifierValue(value);
    }
    get tokenCount() {
        return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount);
    }
    set tokenCount(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount = value.toString();
    }
    get totalAgreedPrice() {
        return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice);
    }
    set totalAgreedPrice(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice = value.toString();
    }
    get tokenActions() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set tokenActions(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions = value.map(a => a._rawSerializedAction);
    }
    get tokenAnchor() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor;
    }
    set tokenAnchor(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor = value;
    }
    get tokenProof() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof;
    }
    set tokenProof(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof = value;
    }
    get tokenBindingSignature() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature;
    }
    set tokenBindingSignature(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature = value;
    }
    get feeActions() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.feeActions.map(SerializedActionWASM.createFromRawInstance);
    }
    set feeActions(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.feeActions = value.map(a => a._rawSerializedAction);
    }
    get feeAnchor() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor;
    }
    set feeAnchor(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor = value;
    }
    get feeProof() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.feeProof;
    }
    set feeProof(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.feeProof = value;
    }
    get feeBindingSignature() {
        return this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature;
    }
    set feeBindingSignature(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature = value;
    }
    get creditAmount() {
        return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount);
    }
    set creditAmount(value) {
        this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount = value.toString();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return TokenPurchaseFromShieldedPoolTransitionWASM.createFromRawInstance(dppProvider.dpp.TokenPurchaseFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenPurchaseFromShieldedPoolTransitionWASM.prototype);
        instance._rawTokenPurchaseFromShieldedPoolTransition = rawInstance;
        return instance;
    }
}
