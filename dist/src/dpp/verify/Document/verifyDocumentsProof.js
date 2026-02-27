import { dppProvider } from '../../provider.js';
import { DocumentWASM } from '../../structs/Document.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export function verifyDocumentsProof(proof, contract, documentTypeName, whereClauses, orderBy, limit, startAt, startAtIncluded, blockTimeMs, platformVersion) {
    const result = dppProvider.dpp.verifyDocumentsProof(proof, contract._rawDataContract, documentTypeName, valueToDynamicValue(whereClauses), orderBy ?? [], limit, startAt != null ? prepareIdentifierValue(startAt) : undefined, startAtIncluded, blockTimeMs?.toString(), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        documents: result.documents.map(DocumentWASM.createFromRawInstance)
    };
}
