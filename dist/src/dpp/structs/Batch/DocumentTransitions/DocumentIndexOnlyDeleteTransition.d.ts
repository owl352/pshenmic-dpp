import type { DocumentIndexOnlyDeleteTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentActionFeeAgreementWASM } from '../DocumentActionFeeAgreement.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentIndexOnlyDeleteTransitionWASM {
    /** @private **/
    _rawDocumentIndexOnlyDeleteTransition: DocumentIndexOnlyDeleteTransitionNAPI;
    /** The document properties identify the indexOnly document being deleted **/
    constructor(document: DocumentWASM, identityContractNonce: bigint, tokenPaymentInfo?: TokenPaymentInfoWASM, actionFeeAgreement?: DocumentActionFeeAgreementWASM);
    get data(): any;
    set data(value: object);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentIndexOnlyDeleteTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentIndexOnlyDeleteTransitionNAPI): DocumentIndexOnlyDeleteTransitionWASM;
}
