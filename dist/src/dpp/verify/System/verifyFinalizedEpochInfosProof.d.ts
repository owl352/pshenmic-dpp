import { PlatformVersionLike, VerifiedFinalizedEpochsInfo } from "../../types.js";
export declare function verifyFinalizedEpochInfosProof(proof: Uint8Array, startEpoch: number, startEpochIncluded: boolean, endEpoch: number, endEpochIncluded: boolean, platformVersion: PlatformVersionLike): VerifiedFinalizedEpochsInfo;
