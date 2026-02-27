import { dppProvider } from '../../../provider.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentUpdatePriceTransitionWASM {
    /** @private **/
    _rawDocumentUpdatePriceTransition;
    constructor(document, identityContractNonce, price, tokenPaymentInfo) {
        this._rawDocumentUpdatePriceTransition = new dppProvider.dpp.DocumentUpdatePriceTransitionNAPI(document._rawDocument, identityContractNonce.toString(), price.toString(), tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentUpdatePriceTransition.base);
    }
    set base(value) {
        this._rawDocumentUpdatePriceTransition.base = value._rawDocumentBaseTransition;
    }
    get price() {
        return BigInt(this._rawDocumentUpdatePriceTransition.price);
    }
    set price(value) {
        this._rawDocumentUpdatePriceTransition.price = value.toString();
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentUpdatePriceTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentUpdatePriceTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentUpdatePriceTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentUpdatePriceTransitionWASM.prototype);
        instance._rawDocumentUpdatePriceTransition = rawInstance;
        return instance;
    }
}
