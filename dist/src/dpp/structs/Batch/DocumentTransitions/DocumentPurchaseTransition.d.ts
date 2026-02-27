import type { DocumentPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentPurchaseTransitionWASM {
    /** @private **/
    _rawDocumentPurchaseTransition: DocumentPurchaseTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, amount: bigint, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    get price(): bigint;
    set price(value: bigint);
    get revision(): bigint;
    set revision(value: bigint);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentPurchaseTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentPurchaseTransitionNAPI): DocumentPurchaseTransitionWASM;
}
