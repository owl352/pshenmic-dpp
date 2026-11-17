import { PlatformVersionLike, VerifiedAddressesTrunkState } from '../../types.js';
/**
 * Verifies a trunk chunk proof for the address funds tree.
 *
 * The trunk covers the top of the tree only. Subtrees below it are truncated
 * and listed in `leafKeys`; use `traceKeyToLeaf` to find which one holds an
 * address, then fetch it with `verifyAddressesBranchState`.
 */
export declare function verifyAddressesTrunkState(proof: Uint8Array, platformVersion: PlatformVersionLike): VerifiedAddressesTrunkState;
