import type { TokenTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike, TokenTransitionLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class TokenTransitionWASM {
    /** @private **/
    _rawTokenTransition: TokenTransitionNAPI;
    constructor(transition: TokenTransitionLike);
    get identityContractNonce(): bigint;
    set identityContractNonce(value: bigint);
    get tokenId(): IdentifierWASM;
    set tokenId(value: IdentifierLike);
    get contractId(): IdentifierWASM;
    set contractId(value: IdentifierLike);
    getTransition(): TokenTransitionLike;
    getTransitionTypeNumber(): number;
    getTransitionType(): string;
    getHistoricalDocumentTypeName(): string;
    getHistoricalDocumentId(ownerId: IdentifierLike): IdentifierWASM;
    idDocumentTransition(): boolean;
    static createFromRawInstance(rawInstance: TokenTransitionNAPI): TokenTransitionWASM;
}
