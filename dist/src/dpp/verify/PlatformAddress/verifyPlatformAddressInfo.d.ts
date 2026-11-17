import { PlatformAddressLike, PlatformVersionLike, VerifiedPlatformAddressInfoWithRootHash } from '../../types.js';
export declare function verifyPlatformAddressInfo(proof: Uint8Array, platformAddress: PlatformAddressLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedPlatformAddressInfoWithRootHash;
