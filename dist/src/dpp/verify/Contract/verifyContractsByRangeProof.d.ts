import { IdentifierLike, PlatformVersionLike, VerifiedContractsByRange } from '../../types.js';
/** A page of the contracts tree in id order; with `idsOnly` no contract is returned **/
export declare function verifyContractsByRangeProof(proof: Uint8Array, startAt: IdentifierLike | undefined, startAtIncluded: boolean, limit: number, idsOnly: boolean, platformVersion: PlatformVersionLike): VerifiedContractsByRange;
