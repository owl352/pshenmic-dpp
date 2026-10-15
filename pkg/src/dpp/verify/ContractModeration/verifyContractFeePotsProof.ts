import { dppProvider } from '../../provider.js'
import { ContractFeePotLike, IdentifierLike, PlatformVersionLike, ProvenContractFeePots, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** The credits in a contract's fee pots and their last claims **/
export function verifyContractFeePotsProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  pots: ContractFeePotLike[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractFeePots> {
  const result = dppProvider.dpp.verifyContractFeePotsProof(
    proof,
    prepareIdentifierValue(contractId),
    pots.map(valueToDynamicValue),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
