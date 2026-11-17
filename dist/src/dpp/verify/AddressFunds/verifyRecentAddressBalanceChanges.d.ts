import { PlatformVersionLike, VerifiedRecentAddressBalanceChanges } from '../../types.js';
/**
 * Verifies a proof of the address balance changes from a block height onwards.
 *
 * `startHeightExclusive` must match the flag the proof was requested with: it
 * selects a range starting just past `startBlockHeight` rather than at it, and
 * the two produce different queries, so a mismatch fails verification.
 */
export declare function verifyRecentAddressBalanceChanges(proof: Uint8Array, startBlockHeight: bigint, startHeightExclusive: boolean, limit: number | undefined, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedRecentAddressBalanceChanges;
