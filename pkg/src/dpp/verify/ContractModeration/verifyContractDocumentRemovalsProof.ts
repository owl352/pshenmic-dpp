import { dppProvider } from '../../provider.js'
import { ContractDocumentRemovalsSelection, IdentifierLike, PlatformVersionLike, ProvenDocumentRemovalEntry, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

function removalsSelectionToPlain (selection: ContractDocumentRemovalsSelection): any {
  if ('documentIds' in selection) {
    return { documentIds: selection.documentIds.map(id => new IdentifierWASM(id as any).bytes()) }
  }

  return {
    startAfter: selection.startAfter != null ? new IdentifierWASM(selection.startAfter as any).bytes() : undefined,
    limit: selection.limit
  }
}

/** The records moderators' document deletions left under a contract, for one document type **/
export function verifyContractDocumentRemovalsProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  documentTypeName: string,
  selection: ContractDocumentRemovalsSelection,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenDocumentRemovalEntry[]> {
  const result = dppProvider.dpp.verifyContractDocumentRemovalsProof(
    proof,
    prepareIdentifierValue(contractId),
    documentTypeName,
    valueToDynamicValue(removalsSelectionToPlain(selection)),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
