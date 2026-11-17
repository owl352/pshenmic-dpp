import type { ShieldFromIdentityTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike } from '../../../dpp/types.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Moves identity credits into the shielded pool **/
export declare class ShieldFromIdentityTransitionWASM {
    /** @private **/
    _rawShieldFromIdentityTransition: ShieldFromIdentityTransitionNAPI;
    constructor(identityId: IdentifierLike, amount: bigint, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array, nonce: bigint, userFeeIncrease?: number);
    get identityId(): IdentifierWASM;
    set identityId(value: IdentifierLike);
    get amount(): bigint;
    set amount(value: bigint);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    get nonce(): bigint;
    set nonce(value: bigint);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): ShieldFromIdentityTransitionWASM;
    static createFromRawInstance(rawInstance: ShieldFromIdentityTransitionNAPI): ShieldFromIdentityTransitionWASM;
}
