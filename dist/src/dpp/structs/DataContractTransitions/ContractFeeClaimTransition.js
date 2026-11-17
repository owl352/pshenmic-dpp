import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../../dpp/utils.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Claims the credits a contract fee pot collected **/
export class ContractFeeClaimTransitionWASM {
    /** @private **/
    _rawContractFeeClaimTransition;
    constructor(ownerId, dataContractId, identityContractNonce, pot, userFeeIncrease) {
        this._rawContractFeeClaimTransition = new dppProvider.dpp.ContractFeeClaimTransitionNAPI(prepareIdentifierValue(ownerId), prepareIdentifierValue(dataContractId), identityContractNonce.toString(), valueToDynamicValue(pot), userFeeIncrease);
    }
    get ownerId() {
        return IdentifierWASM.createFromRawInstance(this._rawContractFeeClaimTransition.ownerId);
    }
    set ownerId(value) {
        this._rawContractFeeClaimTransition.ownerId = prepareIdentifierValue(value);
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawContractFeeClaimTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawContractFeeClaimTransition.dataContractId = prepareIdentifierValue(value);
    }
    get identityContractNonce() {
        return BigInt(this._rawContractFeeClaimTransition.identityContractNonce);
    }
    set identityContractNonce(value) {
        this._rawContractFeeClaimTransition.identityContractNonce = value.toString();
    }
    get pot() {
        return this._rawContractFeeClaimTransition.pot;
    }
    set pot(value) {
        this._rawContractFeeClaimTransition.pot = valueToDynamicValue(value);
    }
    get userFeeIncrease() {
        return this._rawContractFeeClaimTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawContractFeeClaimTransition.userFeeIncrease = value;
    }
    get signaturePublicKeyId() {
        return this._rawContractFeeClaimTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawContractFeeClaimTransition.signaturePublicKeyId = value;
    }
    get signature() {
        return this._rawContractFeeClaimTransition.signature;
    }
    set signature(value) {
        this._rawContractFeeClaimTransition.signature = value;
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawContractFeeClaimTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return ContractFeeClaimTransitionWASM.createFromRawInstance(dppProvider.dpp.ContractFeeClaimTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ContractFeeClaimTransitionWASM.prototype);
        instance._rawContractFeeClaimTransition = rawInstance;
        return instance;
    }
}
