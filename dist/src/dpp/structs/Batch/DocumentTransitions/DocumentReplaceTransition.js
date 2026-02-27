import { dppProvider } from '../../../provider.js';
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentReplaceTransitionWASM {
    /** @private **/
    _rawDocumentReplaceTransition;
    constructor(document, identityContractNonce, tokenPaymentInfo) {
        this._rawDocumentReplaceTransition = new dppProvider.dpp.DocumentReplaceTransitionNAPI(document._rawDocument, identityContractNonce.toString(), tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get data() {
        return valueFromDynamicValue(this._rawDocumentReplaceTransition.data);
    }
    set data(value) {
        this._rawDocumentReplaceTransition.data = valueToDynamicValue(value);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentReplaceTransition.base);
    }
    set base(value) {
        this._rawDocumentReplaceTransition.base = value._rawDocumentBaseTransition;
    }
    get revision() {
        return BigInt(this._rawDocumentReplaceTransition.revision);
    }
    set revision(value) {
        this._rawDocumentReplaceTransition.revision = value.toString();
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentReplaceTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentReplaceTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentReplaceTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentReplaceTransitionWASM.prototype);
        instance._rawDocumentReplaceTransition = rawInstance;
        return instance;
    }
}
