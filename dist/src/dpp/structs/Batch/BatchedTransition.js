import { TokenTransitionWASM } from './TokenTransition.js';
import { DocumentTransitionWASM } from './DocumentTransition.js';
import { dppProvider } from '../../provider.js';
import { IdentifierWASM } from '../Identifier.js';
import { prepareIdentifierValue } from '../../utils.js';
export class BatchedTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(transition) {
        let raw;
        if (transition instanceof DocumentTransitionWASM) {
            raw = new dppProvider.dpp.BatchedTransitionNAPI(transition._rawTransition);
        }
        else {
            raw = new dppProvider.dpp.BatchedTransitionNAPI(transition._rawTokenTransition);
        }
        this._rawTransition = raw;
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTransition.dataContractId = prepareIdentifierValue(value);
    }
    toTransition() {
        const raw = this._rawTransition.toTransition();
        if (raw instanceof dppProvider.dpp.DocumentTransitionNAPI) {
            return DocumentTransitionWASM.createFromRawInstance(raw);
        }
        else {
            return TokenTransitionWASM.createFromRawInstance(raw);
        }
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(BatchedTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
