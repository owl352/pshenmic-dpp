import type { DocumentBaseTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { TokenPaymentInfoWASM } from './TokenPaymentInfo.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class DocumentBaseTransitionWASM {
    /** @private **/
    _rawDocumentBaseTransition: DocumentBaseTransitionNAPI;
    constructor(documentId: IdentifierLike, identityContractNonce: bigint, documentTypeName: string, dataContractId: IdentifierLike, tokenPaymentInfo?: TokenPaymentInfoWASM);
    get id(): IdentifierWASM;
    set id(id: IdentifierLike);
    get identityContractNonce(): bigint;
    set identityContractNonce(identityContractNonce: bigint);
    get dataContractId(): IdentifierWASM;
    set dataContractId(id: IdentifierLike);
    get documentTypeName(): string;
    set documentTypeName(name: string);
    get tokenPaymentInfo(): TokenPaymentInfoWASM | undefined;
    set tokenPaymentInfo(tokenPaymentInfo: TokenPaymentInfoWASM | undefined);
    static createFromRawInstance(rawInstance: DocumentBaseTransitionNAPI): DocumentBaseTransitionWASM;
}
