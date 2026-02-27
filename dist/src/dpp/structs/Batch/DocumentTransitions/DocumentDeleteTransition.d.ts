import type { DocumentDeleteTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM, DocumentTransitionWASM } from '../../../dpp.js';
export declare class DocumentDeleteTransitionWASM {
    /** @private **/
    _rawDocumentDeleteTransition: DocumentDeleteTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentDeleteTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentDeleteTransitionNAPI): DocumentDeleteTransitionWASM;
}
