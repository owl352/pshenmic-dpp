import { PlatformVersionLike, VerifiedRecentCompactedAddressBalanceChanges } from '../../types.js';
/**
 * Verifies a proof of the compacted address balance changes from a block height
 * onwards, where each entry merges a range of blocks.
 *
 * There is no subset flag here: the proof is a self-contained envelope whose
 * predecessor half authenticates which range covers the requested height, so
 * the forward half has nothing to be a subset of.
 */
export declare function verifyRecentCompactedAddressBalanceChanges(proof: Uint8Array, startBlockHeight: bigint, limit: number | undefined, platformVersion: PlatformVersionLike): VerifiedRecentCompactedAddressBalanceChanges;
