import type { IdentityTopUpFromShieldedPoolTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike } from '../../../dpp/types.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Tops up an identity with credits spent from the shielded pool **/
export declare class IdentityTopUpFromShieldedPoolTransitionWASM {
    /** @private **/
    _rawIdentityTopUpFromShieldedPoolTransition: IdentityTopUpFromShieldedPoolTransitionNAPI;
    constructor(identityId: IdentifierLike, actions: SerializedActionWASM[], topUpAmount: bigint, anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array);
    get identityId(): IdentifierWASM;
    set identityId(value: IdentifierLike);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get topUpAmount(): bigint;
    set topUpAmount(value: bigint);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityTopUpFromShieldedPoolTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityTopUpFromShieldedPoolTransitionNAPI): IdentityTopUpFromShieldedPoolTransitionWASM;
}
