import { dppProvider } from '../provider.js';
import { prepareIdentifierValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
export class ContractBoundsWASM {
    /** @private **/
    _rawContractBounds;
    constructor(contractId, documentTypeName) {
        this._rawContractBounds = new dppProvider.dpp.ContractBoundsNAPI(prepareIdentifierValue(contractId), documentTypeName);
    }
    get identifier() {
        return IdentifierWASM.createFromRawInstance(this._rawContractBounds.identifier);
    }
    set identifier(value) {
        this._rawContractBounds.identifier = prepareIdentifierValue(value);
    }
    get documentTypeName() {
        return this._rawContractBounds.documentTypeName;
    }
    set documentTypeName(value) {
        this._rawContractBounds.documentTypeName = value;
    }
    get contractBoundsType() {
        return this._rawContractBounds.contractBoundsType;
    }
    get contractBoundsTypeNumber() {
        return this._rawContractBounds.contractBoundsTypeNumber;
    }
    static SingleContract(contractId) {
        return new ContractBoundsWASM(contractId);
    }
    static SingleContractDocumentType(contractId, documentTypeName) {
        return new ContractBoundsWASM(contractId, documentTypeName);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ContractBoundsWASM.prototype);
        instance._rawContractBounds = rawInstance;
        return instance;
    }
}
