import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, ProvenContractGroupInfo, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** The registration of a contract group, null when there is none **/
export function verifyContractGroupInfoProof (
  proof: Uint8Array,
  contractGroupId: IdentifierLike,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractGroupInfo | null> {
  const result = dppProvider.dpp.verifyContractGroupInfoProof(
    proof,
    prepareIdentifierValue(contractGroupId),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
