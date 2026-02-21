import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedContract } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../../structs/DataContract.js'

export function verifyContractProof (
  proof: Uint8Array,
  contractKnownKeepsHistory: boolean | undefined,
  isProofSubset: boolean,
  inMultipleContractProofForm: boolean,
  contractId: IdentifierLike,
  platformVersion: PlatformVersionLike
): VerifiedContract {
  const result = dppProvider.dpp.verifyContractProof(
    proof,
    contractKnownKeepsHistory,
    isProofSubset,
    inMultipleContractProofForm,
    prepareIdentifierValue(contractId),
    valueToDynamicValue(platformVersion)
  )

  let dataContract: DataContractWASM | undefined

  if (result.dataContract != null) {
    dataContract = DataContractWASM.createFromRawInstance(result.dataContract)
  }

  return {
    rootHash: result.rootHash,
    dataContract
  }
}
