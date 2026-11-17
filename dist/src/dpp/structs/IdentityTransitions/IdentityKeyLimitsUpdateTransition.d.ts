import type { IdentityKeyLimitsUpdateTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike } from '../../../dpp/types.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Changes the budget and expiry of an identity key (platform v14+). `None` removes a limit **/
export declare class IdentityKeyLimitsUpdateTransitionWASM {
    /** @private **/
    _rawIdentityKeyLimitsUpdateTransition: IdentityKeyLimitsUpdateTransitionNAPI;
    constructor(identityId: IdentifierLike, nonce: bigint, keyId: number, totalBudget: bigint | undefined, expiresAt: bigint | undefined, userFeeIncrease?: number);
    get identityId(): IdentifierWASM;
    set identityId(value: IdentifierLike);
    get nonce(): bigint;
    set nonce(value: bigint);
    get keyId(): number;
    set keyId(value: number);
    get totalBudget(): bigint | undefined;
    set totalBudget(value: bigint | undefined);
    get expiresAt(): bigint | undefined;
    set expiresAt(value: bigint | undefined);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityKeyLimitsUpdateTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityKeyLimitsUpdateTransitionNAPI): IdentityKeyLimitsUpdateTransitionWASM;
}
