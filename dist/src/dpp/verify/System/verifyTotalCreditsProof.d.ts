import { PlatformVersionLike, VerifiedTotalCredits } from '../../types.js';
export declare function verifyTotalCreditsProof(proof: Uint8Array, coreSubsidyHalvingInterval: number, activationCoreHeight: number, currentCoreHeight: number, platformVersion: PlatformVersionLike): VerifiedTotalCredits;
