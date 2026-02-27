import type { TokenBurnTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
export declare class TokenBurnTransitionWASM {
    /** @private **/
    _rawTransition: TokenBurnTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, burnAmount: bigint, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get burnAmount(): bigint;
    set burnAmount(value: bigint);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenBurnTransitionNAPI): TokenBurnTransitionWASM;
}
