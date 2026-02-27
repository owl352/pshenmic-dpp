import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class VotePollWASM {
    /** @private **/
    _rawVotePollWASM;
    constructor(contractId, documentTypeName, indexName, indexValues) {
        this._rawVotePollWASM = new dppProvider.dpp.VotePollNAPI(prepareIdentifierValue(contractId), documentTypeName, indexName, valueToDynamicValue(indexValues));
    }
    get contractId() {
        return IdentifierWASM.createFromRawInstance(this._rawVotePollWASM.contractId);
    }
    set contractId(value) {
        this._rawVotePollWASM.contractId = prepareIdentifierValue(value);
    }
    get documentTypeName() {
        return this._rawVotePollWASM.documentTypeName;
    }
    set documentTypeName(value) {
        this._rawVotePollWASM.documentTypeName = value;
    }
    get indexName() {
        return this._rawVotePollWASM.indexName;
    }
    set indexName(value) {
        this._rawVotePollWASM.indexName = value;
    }
    get indexValues() {
        return this._rawVotePollWASM.indexValues;
    }
    set indexValues(values) {
        this._rawVotePollWASM.indexValues = valueToDynamicValue(values);
    }
    toString() {
        return this._rawVotePollWASM.toString();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(VotePollWASM.prototype);
        instance._rawVotePollWASM = rawInstance;
        return instance;
    }
}
