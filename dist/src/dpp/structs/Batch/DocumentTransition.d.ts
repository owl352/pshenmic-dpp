import type { DocumentTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { DocumentCreateTransitionWASM } from './DocumentTransitions/DocumentCreateTransition.js';
import { DocumentReplaceTransitionWASM } from './DocumentTransitions/DocumentReplaceTransition.js';
import { DocumentDeleteTransitionWASM } from './DocumentTransitions/DocumentDeleteTransition.js';
import { DocumentPurchaseTransitionWASM } from './DocumentTransitions/DocumentPurchaseTransition.js';
import { DocumentTransferTransitionWASM } from './DocumentTransitions/DocumentTransferTransition.js';
import { DocumentUpdatePriceTransitionWASM } from './DocumentTransitions/DocumentUpdatePriceTransition.js';
import { DocumentTransitionLike, IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class DocumentTransitionWASM {
    /** @private **/
    _rawTransition: DocumentTransitionNAPI;
    constructor(transition: DocumentTransitionLike);
    get actionType(): string;
    get actionTypeNumber(): number;
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    get id(): IdentifierWASM;
    get documentTypeName(): string;
    get identityContractNonce(): bigint;
    set identityContractNonce(value: bigint);
    get revision(): bigint | undefined;
    set revision(value: bigint);
    get entropy(): Uint8Array | undefined;
    get createTransition(): DocumentCreateTransitionWASM;
    get deleteTransition(): DocumentDeleteTransitionWASM;
    get purchaseTransition(): DocumentPurchaseTransitionWASM;
    get replaceTransition(): DocumentReplaceTransitionWASM;
    get transferTransition(): DocumentTransferTransitionWASM;
    get updatePriceTransition(): DocumentUpdatePriceTransitionWASM;
    idDocumentTransition(): boolean;
    static createFromRawInstance(rawInstance: DocumentTransitionNAPI): DocumentTransitionWASM;
}
