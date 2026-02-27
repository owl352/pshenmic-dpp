import type { DocumentTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { IdentifierLike } from '../../../types.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { IdentifierWASM } from '../../Identifier.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentTransferTransitionWASM {
    /** @private **/
    _rawDocumentTransferTransition: DocumentTransferTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, recipient: IdentifierLike, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    get recipientId(): IdentifierWASM;
    set recipientId(value: IdentifierLike);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentTransferTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentTransferTransitionNAPI): DocumentTransferTransitionWASM;
}
