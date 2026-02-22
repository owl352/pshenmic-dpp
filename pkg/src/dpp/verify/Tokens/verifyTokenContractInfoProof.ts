import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedTokenContractInfo } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

export function verifyTokenContractInfoProof (
  proof: Uint8Array,
  tokenId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedTokenContractInfo {
  const result = dppProvider.dpp.verifyTokenContractInfoProof(
    proof,
    prepareIdentifierValue(tokenId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    contractInfo: result.contractInfo != null
      ? {
          contractId: IdentifierWASM.createFromRawInstance(result.contractInfo.contractId),
          tokenContractPosition: result.contractInfo.tokenContractPosition
        }
      : undefined
  }
}
