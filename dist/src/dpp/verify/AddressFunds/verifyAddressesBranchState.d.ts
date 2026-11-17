import { PlatformVersionLike, VerifiedAddressesBranchState } from '../../types.js';
/**
 * Verifies a branch chunk proof for the address funds tree.
 *
 * `expectedRootHash` must be the `hash` the parent trunk or branch reported for
 * `key`; it is what anchors this subtree to the proven root, so the result
 * carries no root hash of its own.
 *
 * `depth` is validated against an allowed range, so take it from the parent
 * trunk's `chunkDepths` rather than picking a value.
 */
export declare function verifyAddressesBranchState(proof: Uint8Array, key: Uint8Array, depth: number, expectedRootHash: Uint8Array, platformVersion: PlatformVersionLike): VerifiedAddressesBranchState;
