import { dppProvider } from '../../../provider.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentPurchaseTransitionWASM {
    /** @private **/
    _rawDocumentPurchaseTransition;
    constructor(document, identityContractNonce, amount, tokenPaymentInfo) {
        this._rawDocumentPurchaseTransition = new dppProvider.dpp.DocumentPurchaseTransitionNAPI(document._rawDocument, identityContractNonce.toString(), amount.toString(), tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentPurchaseTransition.base);
    }
    set base(value) {
        this._rawDocumentPurchaseTransition.base = value._rawDocumentBaseTransition;
    }
    get price() {
        return BigInt(this._rawDocumentPurchaseTransition.price);
    }
    set price(value) {
        this._rawDocumentPurchaseTransition.price = value.toString();
    }
    get revision() {
        return BigInt(this._rawDocumentPurchaseTransition.revision);
    }
    set revision(value) {
        this._rawDocumentPurchaseTransition.revision = value.toString();
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentPurchaseTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentPurchaseTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentPurchaseTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentPurchaseTransitionWASM.prototype);
        instance._rawDocumentPurchaseTransition = rawInstance;
        return instance;
    }
}
