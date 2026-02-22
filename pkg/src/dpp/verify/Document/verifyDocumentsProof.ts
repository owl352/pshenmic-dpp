import {dppProvider} from "../../provider.js";
import {IdentifierLike, PlatformVersionLike, VerifiedDocuments, WhereClause} from "../../types.js";
import {DocumentWASM} from "../../structs/Document.js";
import {DataContractWASM} from "../../structs/DataContract.js";
import {prepareIdentifierValue, valueToDynamicValue} from "../../utils.js";

export function verifyDocumentsProof(
  proof: Uint8Array,
  contract: DataContractWASM,
  documentTypeName: string,
  whereClauses: WhereClause[],
  orderBy: Array<Array<string>>,
  limit: number | undefined | null,
  startAt: IdentifierLike | undefined | null,
  startAtIncluded: boolean,
  blockTimeMs: bigint | undefined | null,
  platformVersion: PlatformVersionLike
): VerifiedDocuments {
  const result = dppProvider.dpp.verifyDocumentsProof(
    proof,
    contract._rawDataContract,
    documentTypeName,
    valueToDynamicValue(whereClauses),
    orderBy,
    limit,
    startAt!=null?prepareIdentifierValue(startAt):undefined,
    startAtIncluded,
    blockTimeMs?.toString(),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    documents: result.documents.map(DocumentWASM.createFromRawInstance)
  }
}
