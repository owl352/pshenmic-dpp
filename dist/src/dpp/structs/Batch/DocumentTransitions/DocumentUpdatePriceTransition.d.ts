import type { DocumentUpdatePriceTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentUpdatePriceTransitionWASM {
    /** @private **/
    _rawDocumentUpdatePriceTransition: DocumentUpdatePriceTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, price: bigint, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    get price(): bigint;
    set price(value: bigint);
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentUpdatePriceTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentUpdatePriceTransitionNAPI): DocumentUpdatePriceTransitionWASM;
}
