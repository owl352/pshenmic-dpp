import type { TokenUnFreezeTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { IdentifierLike } from '../../../types.js';
import { IdentifierWASM } from '../../Identifier.js';
export declare class TokenUnFreezeTransitionWASM {
    /** @private **/
    _rawTransition: TokenUnFreezeTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, frozenIdentityId: IdentifierLike, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get frozenIdentityId(): IdentifierWASM;
    set frozenIdentityId(value: IdentifierLike);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenUnFreezeTransitionNAPI): TokenUnFreezeTransitionWASM;
}
