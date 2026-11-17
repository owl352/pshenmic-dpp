import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { plainIdentifiersToBytes, prepareIdentifierValue, valueToDynamicValue, valueFromDynamicValue } from '../../../dpp/utils.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** A moderator action on a contract user or document. The action is a plain object tagged with `$type` **/
export class ContractUserModerationTransitionWASM {
    /** @private **/
    _rawContractUserModerationTransition;
    constructor(ownerId, dataContractId, identityContractNonce, action, userFeeIncrease) {
        this._rawContractUserModerationTransition = new dppProvider.dpp.ContractUserModerationTransitionNAPI(prepareIdentifierValue(ownerId), prepareIdentifierValue(dataContractId), identityContractNonce.toString(), valueToDynamicValue(plainIdentifiersToBytes(action)), userFeeIncrease);
    }
    get ownerId() {
        return IdentifierWASM.createFromRawInstance(this._rawContractUserModerationTransition.ownerId);
    }
    set ownerId(value) {
        this._rawContractUserModerationTransition.ownerId = prepareIdentifierValue(value);
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawContractUserModerationTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawContractUserModerationTransition.dataContractId = prepareIdentifierValue(value);
    }
    get identityContractNonce() {
        return BigInt(this._rawContractUserModerationTransition.identityContractNonce);
    }
    set identityContractNonce(value) {
        this._rawContractUserModerationTransition.identityContractNonce = value.toString();
    }
    get action() {
        return valueFromDynamicValue(this._rawContractUserModerationTransition.action, true);
    }
    set action(value) {
        this._rawContractUserModerationTransition.action = valueToDynamicValue(plainIdentifiersToBytes(value));
    }
    get userFeeIncrease() {
        return this._rawContractUserModerationTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawContractUserModerationTransition.userFeeIncrease = value;
    }
    get signaturePublicKeyId() {
        return this._rawContractUserModerationTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawContractUserModerationTransition.signaturePublicKeyId = value;
    }
    get signature() {
        return this._rawContractUserModerationTransition.signature;
    }
    set signature(value) {
        this._rawContractUserModerationTransition.signature = value;
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawContractUserModerationTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return ContractUserModerationTransitionWASM.createFromRawInstance(dppProvider.dpp.ContractUserModerationTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ContractUserModerationTransitionWASM.prototype);
        instance._rawContractUserModerationTransition = rawInstance;
        return instance;
    }
}
