import type { TokenClaimTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenDistributionLike } from '../../../types.js';
export declare class TokenClaimTransitionWASM {
    /** @private **/
    _rawTransition: TokenClaimTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, distributionType: TokenDistributionLike, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get distributionType(): string;
    set distributionType(value: TokenDistributionLike);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenClaimTransitionNAPI): TokenClaimTransitionWASM;
}
