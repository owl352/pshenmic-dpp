import type { TokenUnshieldTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../../dpp/structs/Identifier.js';
import { IdentifierLike } from '../../../../dpp/types.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Moves tokens from the token shielded pool to an identity balance **/
export declare class TokenUnshieldTransitionWASM {
    /** @private **/
    _rawTransition: TokenUnshieldTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, amount: bigint, recipientId: IdentifierLike, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get amount(): bigint;
    set amount(value: bigint);
    get recipientId(): IdentifierWASM;
    set recipientId(value: IdentifierLike);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static createFromRawInstance(rawInstance: TokenUnshieldTransitionNAPI): TokenUnshieldTransitionWASM;
}
