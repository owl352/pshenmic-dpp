import type { DocumentCreateTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { DocumentWASM } from '../../Document.js';
import { PrefundedVotingBalanceWASM } from '../PrefundedVotingBalance.js';
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export declare class DocumentCreateTransitionWASM {
    /** @private **/
    _rawDocumentCreateTransition: DocumentCreateTransitionNAPI;
    constructor(document: DocumentWASM, identityContractNonce: bigint, prefundedVotingBalance?: PrefundedVotingBalanceWASM, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get data(): object;
    set data(value: object);
    get base(): DocumentBaseTransitionWASM;
    set base(value: DocumentBaseTransitionWASM);
    get entropy(): Uint8Array;
    set entropy(value: Uint8Array);
    get prefundedVotingBalance(): PrefundedVotingBalanceWASM | undefined;
    set prefundedVotingBalance(value: PrefundedVotingBalanceWASM | undefined);
    clearPrefundedVotingBalance(): void;
    toDocumentTransition(): DocumentTransitionWASM;
    static fromDocumentTransition(transition: DocumentTransitionWASM): DocumentCreateTransitionWASM;
    static createFromRawInstance(rawInstance: DocumentCreateTransitionNAPI): DocumentCreateTransitionWASM;
}
