import type { DocumentReplaceTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentReplaceTransitionWASM {
    /** @private **/
    _rawDocumentReplaceTransition: DocumentReplaceTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get data(): object;
    set data(value: object);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    get revision(): bigint;
    set revision(value: bigint);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentReplaceTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentReplaceTransitionNAPI): DocumentReplaceTransitionWASM;
}
