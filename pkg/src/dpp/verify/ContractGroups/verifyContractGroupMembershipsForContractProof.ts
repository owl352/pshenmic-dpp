import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, ProvenContractGroupMemberships, VerifiedProof } from '../../types.js'
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'

function membershipsFromPlain (value: any): ProvenContractGroupMemberships {
  return {
    contract: value.contract.map(identifierFromBytes),
    documentTypes: Object.fromEntries(
      Object.entries(value.documentTypes).map(([name, ids]) => [name, (ids as Uint8Array[]).map(identifierFromBytes)])
    ),
    tokens: value.tokens.map((token: any) => ({
      tokenContractPosition: token.tokenContractPosition,
      contractGroupIds: token.contractGroupIds.map(identifierFromBytes)
    }))
  }
}

/** The groups a contract, each of its document types and each of its tokens belong to **/
export function verifyContractGroupMembershipsForContractProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractGroupMemberships> {
  const result = dppProvider.dpp.verifyContractGroupMembershipsForContractProof(
    proof,
    prepareIdentifierValue(contractId),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: membershipsFromPlain(valueFromDynamicValue(result.value))
  }
}
