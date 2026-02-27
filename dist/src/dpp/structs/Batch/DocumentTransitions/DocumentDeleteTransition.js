import { DocumentBaseTransitionWASM, DocumentTransitionWASM } from '../../../dpp.js';
import { dppProvider } from '../../../provider.js';
export class DocumentDeleteTransitionWASM {
    /** @private **/
    _rawDocumentDeleteTransition;
    constructor(document, identityContractNonce, tokenPaymentInfo) {
        this._rawDocumentDeleteTransition = new dppProvider.dpp.DocumentDeleteTransitionNAPI(document._rawDocument, identityContractNonce?.toString(), tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentDeleteTransition.base);
    }
    set base(value) {
        this._rawDocumentDeleteTransition.base = value._rawDocumentBaseTransition;
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentDeleteTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentDeleteTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentDeleteTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentDeleteTransitionWASM.prototype);
        instance._rawDocumentDeleteTransition = rawInstance;
        return instance;
    }
}
