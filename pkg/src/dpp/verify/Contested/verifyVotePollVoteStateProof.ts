import { dppProvider } from '../../provider.js'
import {
  PlatformVersionLike,
  StartAt,
  VerifiedVoteState,
  VoteStateResultTypeLike
} from '../../types.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import { valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

export function verifyVotePollVoteStateProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  documentTypeName: string,
  indexName: string,
  indexValues: string[],
  resultType: VoteStateResultTypeLike,
  allowIncludeLockedAndAbstainingVoteTally: boolean,
  count: number | undefined,
  startAt: StartAt | undefined,
  platformVersion: PlatformVersionLike
): VerifiedVoteState {
  const result = dppProvider.dpp.verifyVotePollVoteStateProof(
    proof,
    contract._rawDataContract,
    documentTypeName,
    indexName,
    valueToDynamicValue(indexValues),
    valueToDynamicValue(resultType),
    allowIncludeLockedAndAbstainingVoteTally,
    count,
    valueToDynamicValue(startAt),
    valueToDynamicValue(platformVersion)
  )

  const winner = valueFromDynamicValue(result.result.winner)

  const outWinner = winner == null
    ? undefined
    : {
        type: winner.type,
        identityId: winner.identityId,
        blockInfo: winner.blockInfo
      }

  return {
    rootHash: result.rootHash,
    result: {
      lockedVoteTally: result.result.lockedVoteTally ?? undefined,
      contenders: result.result.contenders.map(c => ({
        identityId: IdentifierWASM.createFromRawInstance(c.identityId),
        serializedDocument: c.serializedDocument ?? undefined,
        voteTally: c.voteTally ?? undefined
      })),
      abstainingVoteTally: result.result.abstainingVoteTally ?? undefined,
      winner: outWinner,
      skipped: result.result.skipped
    }
  }
}
