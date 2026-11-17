import { PlatformAddressLike, PlatformVersionLike, VerifiedPlatformAddressesInfosWithRootHash } from '../../types.js';
export declare function verifyPlatformAddressesInfos(proof: Uint8Array, platformAddresses: PlatformAddressLike[], verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedPlatformAddressesInfosWithRootHash;
