import type { TokenClaimToPoolTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenDistributionLike } from '../../../../dpp/types.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Claims a token distribution into the token shielded pool **/
export declare class TokenClaimToPoolTransitionWASM {
    /** @private **/
    _rawTransition: TokenClaimToPoolTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, distributionType: TokenDistributionLike, claimUpTo: bigint | undefined, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get distributionType(): string;
    set distributionType(value: TokenDistributionLike);
    get claimUpTo(): bigint | undefined;
    set claimUpTo(value: bigint | undefined);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenClaimToPoolTransitionNAPI): TokenClaimToPoolTransitionWASM;
}
