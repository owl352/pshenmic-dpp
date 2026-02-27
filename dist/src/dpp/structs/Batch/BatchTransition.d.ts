import type { BatchTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { BatchedTransitionWASM } from './BatchedTransition.js';
import { DocumentTransitionWASM } from './DocumentTransition.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class BatchTransitionWASM {
    /** @private **/
    _rawBatchTransition: BatchTransitionNAPI;
    constructor(transitions: BatchedTransitionWASM[], ownerId: IdentifierLike, userFeeIncrease?: number, signaturePublicKeyId?: number, signature?: Uint8Array);
    constructor(transitions: DocumentTransitionWASM[], ownerId: IdentifierLike, userFeeIncrease?: number, signaturePublicKeyId?: number, signature?: Uint8Array);
    get transitions(): BatchedTransitionWASM[];
    set transitions(value: BatchedTransitionWASM[]);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get allPurchasesAmount(): bigint | undefined;
    get ownerId(): IdentifierWASM;
    get modifiedDataIds(): IdentifierWASM[];
    get allConflictingIndexCollateralVotingFunds(): bigint | undefined;
    setIdentityContractNonce(nonce: bigint): void;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromV1BatchedTransitions(batchedTransitions: BatchedTransitionWASM[], ownerId: IdentifierLike, userFeeIncrease?: number, signaturePublicKeyId?: number, signature?: Uint8Array): BatchTransitionWASM;
    static fromV0Transitions(documentTransitions: DocumentTransitionWASM[], ownerId: IdentifierLike, userFeeIncrease?: number, signaturePublicKeyId?: number, signature?: Uint8Array): BatchTransitionWASM;
    static fromBytes(bytes: Uint8Array): BatchTransitionWASM;
    static fromBase64(base64: string): BatchTransitionWASM;
    static fromHex(hex: string): BatchTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): BatchTransitionWASM;
    static createFromRawInstance(rawInstance: BatchTransitionNAPI): BatchTransitionWASM;
}
