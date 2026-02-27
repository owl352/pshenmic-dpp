import type { MasternodeVoteTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { VoteWASM } from './Vote.js';
import { IdentifierWASM } from '../Identifier.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class MasternodeVoteTransitionWASM {
    /** @private **/
    _rawMasternodeVoteTransition: MasternodeVoteTransitionNAPI;
    constructor(proTxHash: IdentifierLike, voterId: IdentifierLike, vote: VoteWASM, nonce: bigint, signaturePublicKey?: number, signature?: Uint8Array);
    get proTxHash(): IdentifierWASM;
    set proTxHash(id: IdentifierLike);
    get voterIdentityId(): IdentifierWASM;
    set voterIdentityId(id: IdentifierLike);
    get vote(): VoteWASM;
    set vote(vote: VoteWASM);
    get nonce(): bigint;
    set nonce(nonce: bigint);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(keyId: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get assetLock(): AssetLockProofWASM | undefined;
    get modifiedDataIds(): IdentifierWASM[];
    getSignableBytes(): Uint8Array;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): MasternodeVoteTransitionWASM;
    static fromHex(hex: string): MasternodeVoteTransitionWASM;
    static fromBase64(base64: string): MasternodeVoteTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): MasternodeVoteTransitionWASM;
    static createFromRawInstance(rawInstance: MasternodeVoteTransitionNAPI): MasternodeVoteTransitionWASM;
}
