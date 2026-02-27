import { dppProvider } from '../../provider.js';
import { BatchedTransitionWASM } from './BatchedTransition.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class BatchTransitionWASM {
    /** @private **/
    _rawBatchTransition;
    constructor(transitions, ownerId, userFeeIncrease, signaturePublicKeyId, signature) {
        if (transitions.length === 0) {
            throw new Error('transitions array must not be empty');
        }
        const [transition] = transitions;
        if (transition instanceof BatchedTransitionWASM) {
            this._rawBatchTransition = dppProvider.dpp.BatchTransitionNAPI.fromV1BatchedTransitions(transitions.map(t => t._rawTransition), prepareIdentifierValue(ownerId), userFeeIncrease, signaturePublicKeyId, signature);
        }
        else {
            this._rawBatchTransition = dppProvider.dpp.BatchTransitionNAPI.fromV0Transitions(transitions.map(t => t._rawTransition), prepareIdentifierValue(ownerId), userFeeIncrease, signaturePublicKeyId, signature);
        }
    }
    get transitions() {
        return this._rawBatchTransition.transitions.map(BatchedTransitionWASM.createFromRawInstance);
    }
    set transitions(value) {
        this._rawBatchTransition.transitions = value.map(t => t._rawTransition);
    }
    get signature() {
        return this._rawBatchTransition.signature;
    }
    set signature(value) {
        this._rawBatchTransition.signature = value;
    }
    get signaturePublicKeyId() {
        return this._rawBatchTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawBatchTransition.signaturePublicKeyId = value;
    }
    get allPurchasesAmount() {
        const amount = this._rawBatchTransition.allPurchasesAmount;
        if (amount != null) {
            return BigInt(amount);
        }
    }
    get ownerId() {
        return IdentifierWASM.createFromRawInstance(this._rawBatchTransition.ownerId);
    }
    get modifiedDataIds() {
        return this._rawBatchTransition.modifiedDataIds.map(IdentifierWASM.createFromRawInstance);
    }
    get allConflictingIndexCollateralVotingFunds() {
        const funds = this._rawBatchTransition.allConflictingIndexCollateralVotingFunds;
        if (funds != null) {
            return BigInt(funds);
        }
    }
    setIdentityContractNonce(nonce) {
        this._rawBatchTransition.setIdentityContractNonce(nonce.toString());
    }
    bytes() {
        return this._rawBatchTransition.bytes();
    }
    hex() {
        return this._rawBatchTransition.hex();
    }
    base64() {
        return this._rawBatchTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawBatchTransition.toStateTransition());
    }
    static fromV1BatchedTransitions(batchedTransitions, ownerId, userFeeIncrease, signaturePublicKeyId, signature) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromV1BatchedTransitions(batchedTransitions.map(t => t._rawTransition), prepareIdentifierValue(ownerId), userFeeIncrease, signaturePublicKeyId, signature));
    }
    static fromV0Transitions(documentTransitions, ownerId, userFeeIncrease, signaturePublicKeyId, signature) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromV0Transitions(documentTransitions.map(t => t._rawTransition), prepareIdentifierValue(ownerId), userFeeIncrease, signaturePublicKeyId, signature));
    }
    static fromBytes(bytes) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromBytes(bytes));
    }
    static fromBase64(base64) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromBase64(base64));
    }
    static fromHex(hex) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromHex(hex));
    }
    static fromStateTransition(stateTransition) {
        return BatchTransitionWASM.createFromRawInstance(dppProvider.dpp.BatchTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(BatchTransitionWASM.prototype);
        instance._rawBatchTransition = rawInstance;
        return instance;
    }
}
