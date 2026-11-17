import { dppProvider } from '../../../provider.js';
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentIndexOnlyDeleteTransitionWASM {
    /** @private **/
    _rawDocumentIndexOnlyDeleteTransition;
    /** The document properties identify the indexOnly document being deleted **/
    constructor(document, identityContractNonce, tokenPaymentInfo, actionFeeAgreement) {
        this._rawDocumentIndexOnlyDeleteTransition = new dppProvider.dpp.DocumentIndexOnlyDeleteTransitionNAPI(document._rawDocument, identityContractNonce?.toString(), tokenPaymentInfo?._rawTokenPaymentInfo, actionFeeAgreement?._rawDocumentActionFeeAgreement);
    }
    get data() {
        return valueFromDynamicValue(this._rawDocumentIndexOnlyDeleteTransition.data, true);
    }
    set data(value) {
        this._rawDocumentIndexOnlyDeleteTransition.data = valueToDynamicValue(value);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentIndexOnlyDeleteTransition.base);
    }
    set base(value) {
        this._rawDocumentIndexOnlyDeleteTransition.base = value._rawDocumentBaseTransition;
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentIndexOnlyDeleteTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentIndexOnlyDeleteTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentIndexOnlyDeleteTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentIndexOnlyDeleteTransitionWASM.prototype);
        instance._rawDocumentIndexOnlyDeleteTransition = rawInstance;
        return instance;
    }
}
