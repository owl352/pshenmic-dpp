import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedVotePollsByEndDate, VotePollsByEndDateTimeBound } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { VotePollWASM } from '../../structs/MasternodeVote/VotePoll.js'

/**
 * Verifies a `getVotePollsByEndDate` proof and returns the vote polls grouped by end timestamp, in the requested order.
 *
 * `startTime`, `endTime`, `limit` and `ascending` must match the request, since they define the proven query.
 * Without a `limit` the node's default page is assumed. Proved requests can't carry an offset.
 */
export function verifyVotePollsByEndDateProof (
  proof: Uint8Array,
  startTime: VotePollsByEndDateTimeBound | undefined | null,
  endTime: VotePollsByEndDateTimeBound | undefined | null,
  limit: number | undefined | null,
  ascending: boolean,
  platformVersion: PlatformVersionLike
): VerifiedVotePollsByEndDate {
  const result = dppProvider.dpp.verifyVotePollsByEndDateProof(
    proof,
    startTime?.timeMs.toString(),
    startTime?.included,
    endTime?.timeMs.toString(),
    endTime?.included,
    limit ?? undefined,
    ascending,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    votePolls: result.votePolls.map((group) => ({
      timestampMs: BigInt(group.timestampMs),
      votePolls: group.votePolls.map((votePoll) => VotePollWASM.createFromRawInstance(votePoll))
    }))
  }
}
