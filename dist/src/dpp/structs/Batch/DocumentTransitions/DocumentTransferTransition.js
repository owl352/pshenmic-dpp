import { dppProvider } from '../../../provider.js';
import { prepareIdentifierValue } from '../../../utils.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { IdentifierWASM } from '../../Identifier.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentTransferTransitionWASM {
    /** @private **/
    _rawDocumentTransferTransition;
    constructor(document, identityContractNonce, recipient, tokenPaymentInfo) {
        this._rawDocumentTransferTransition = new dppProvider.dpp.DocumentTransferTransitionNAPI(document._rawDocument, identityContractNonce.toString(), prepareIdentifierValue(recipient), tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentTransferTransition.base);
    }
    set base(value) {
        this._rawDocumentTransferTransition.base = value._rawDocumentBaseTransition;
    }
    get recipientId() {
        return IdentifierWASM.createFromRawInstance(this._rawDocumentTransferTransition.recipientId);
    }
    set recipientId(value) {
        this._rawDocumentTransferTransition.recipientId = prepareIdentifierValue(value);
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentTransferTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentTransferTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentTransferTransitionWASM.prototype);
        instance._rawDocumentTransferTransition = rawInstance;
        return instance;
    }
}
