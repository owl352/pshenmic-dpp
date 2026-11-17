import type { TokenUnshieldWithShieldedFeeTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike } from '../../../dpp/types.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Unshields tokens to an identity, paying the fee from the credit shielded pool **/
export declare class TokenUnshieldWithShieldedFeeTransitionWASM {
    /** @private **/
    _rawTokenUnshieldWithShieldedFeeTransition: TokenUnshieldWithShieldedFeeTransitionNAPI;
    constructor(dataContractId: IdentifierLike, tokenContractPosition: number, tokenId: IdentifierLike, recipientId: IdentifierLike, amount: bigint, tokenActions: SerializedActionWASM[], tokenAnchor: Uint8Array, tokenProof: Uint8Array, tokenBindingSignature: Uint8Array, feeActions: SerializedActionWASM[], feeAnchor: Uint8Array, feeProof: Uint8Array, feeBindingSignature: Uint8Array, creditAmount: bigint);
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    get tokenContractPosition(): number;
    set tokenContractPosition(value: number);
    get tokenId(): IdentifierWASM;
    set tokenId(value: IdentifierLike);
    get recipientId(): IdentifierWASM;
    set recipientId(value: IdentifierLike);
    get amount(): bigint;
    set amount(value: bigint);
    get tokenActions(): SerializedActionWASM[];
    set tokenActions(value: SerializedActionWASM[]);
    get tokenAnchor(): Uint8Array;
    set tokenAnchor(value: Uint8Array);
    get tokenProof(): Uint8Array;
    set tokenProof(value: Uint8Array);
    get tokenBindingSignature(): Uint8Array;
    set tokenBindingSignature(value: Uint8Array);
    get feeActions(): SerializedActionWASM[];
    set feeActions(value: SerializedActionWASM[]);
    get feeAnchor(): Uint8Array;
    set feeAnchor(value: Uint8Array);
    get feeProof(): Uint8Array;
    set feeProof(value: Uint8Array);
    get feeBindingSignature(): Uint8Array;
    set feeBindingSignature(value: Uint8Array);
    get creditAmount(): bigint;
    set creditAmount(value: bigint);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): TokenUnshieldWithShieldedFeeTransitionWASM;
    static createFromRawInstance(rawInstance: TokenUnshieldWithShieldedFeeTransitionNAPI): TokenUnshieldWithShieldedFeeTransitionWASM;
}
