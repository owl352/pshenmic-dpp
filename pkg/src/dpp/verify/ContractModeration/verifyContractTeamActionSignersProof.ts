import { dppProvider } from '../../provider.js'
import { GroupActionStatusLike, IdentifierLike, PlatformVersionLike, VerifiedProof } from '../../types.js'
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

/** The members who approved a contract team action **/
export function verifyContractTeamActionSignersProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  status: GroupActionStatusLike,
  actionId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<IdentifierWASM[]> {
  const result = dppProvider.dpp.verifyContractTeamActionSignersProof(
    proof,
    prepareIdentifierValue(contractId),
    valueToDynamicValue(status),
    prepareIdentifierValue(actionId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: valueFromDynamicValue(result.value).map(identifierFromBytes)
  }
}
