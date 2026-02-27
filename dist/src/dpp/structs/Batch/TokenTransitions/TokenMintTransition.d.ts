import type { TokenMintTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { IdentifierLike } from '../../../types.js';
import { IdentifierWASM } from '../../Identifier.js';
export declare class TokenMintTransitionWASM {
    /** @private **/
    _rawTransition: TokenMintTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, issueToIdentityId: IdentifierLike | undefined, amount: bigint, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get issuedToIdentityId(): IdentifierWASM | undefined;
    set issuedToIdentityId(value: IdentifierLike | undefined);
    get amount(): bigint;
    set amount(value: bigint);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenMintTransitionNAPI): TokenMintTransitionWASM;
}
