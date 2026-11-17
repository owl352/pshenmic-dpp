import { PlatformVersionLike, VerifiedEpochsInfo } from '../../types.js';
export declare function verifyEpochsInfoProof(proof: Uint8Array, currentEpoch: number, startEpoch: number | undefined, count: number, ascending: boolean, platformVersion: PlatformVersionLike): VerifiedEpochsInfo;
