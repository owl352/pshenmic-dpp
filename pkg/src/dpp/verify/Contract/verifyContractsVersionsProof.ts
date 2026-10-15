import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, ProvenContractVersion, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** The latest version of each requested contract, null for a contract that does not exist **/
export function verifyContractsVersionsProof (
  proof: Uint8Array,
  contractIds: IdentifierLike[],
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractVersion[]> {
  const result = dppProvider.dpp.verifyContractsVersionsProof(
    proof,
    contractIds.map(prepareIdentifierValue),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
