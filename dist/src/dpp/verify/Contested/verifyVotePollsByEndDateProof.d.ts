import { PlatformVersionLike, VerifiedVotePollsByEndDate, VotePollsByEndDateTimeBound } from '../../types.js';
/**
 * Verifies a `getVotePollsByEndDate` proof and returns the vote polls grouped by end timestamp, in the requested order.
 *
 * `startTime`, `endTime`, `limit` and `ascending` must match the request, since they define the proven query.
 * Without a `limit` the node's default page is assumed. Proved requests can't carry an offset.
 */
export declare function verifyVotePollsByEndDateProof(proof: Uint8Array, startTime: VotePollsByEndDateTimeBound | undefined | null, endTime: VotePollsByEndDateTimeBound | undefined | null, limit: number | undefined | null, ascending: boolean, platformVersion: PlatformVersionLike): VerifiedVotePollsByEndDate;
