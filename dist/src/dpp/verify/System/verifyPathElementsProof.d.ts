import { PlatformVersionLike, VerifiedPathElements } from '../../types.js';
/**
 * Verifies a `getPathElements` proof: the elements stored under `keys` in the subtree at `path`
 */
export declare function verifyPathElementsProof(proof: Uint8Array, path: Uint8Array[], keys: Uint8Array[], platformVersion: PlatformVersionLike): VerifiedPathElements;
