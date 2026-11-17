import { dppProvider } from '../../provider.js';
import { DocumentWASM } from '../../structs/Document.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/**
 * `blockTimeMs` reads history-keeping documents as of that time. `metadataTimeMs` (the timeMs of the
 * response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyDocumentsProof(proof, contract, documentTypeName, whereClauses, orderBy, limit, startAt, startAtIncluded, blockTimeMs, platformVersion, metadataTimeMs) {
    const result = dppProvider.dpp.verifyDocumentsProof(proof, contract._rawDataContract, documentTypeName, valueToDynamicValue(whereClauses), orderBy ?? [], limit, startAt != null ? prepareIdentifierValue(startAt) : undefined, startAtIncluded, blockTimeMs?.toString(), valueToDynamicValue(platformVersion), metadataTimeMs?.toString());
    return {
        rootHash: result.rootHash,
        documents: result.documents.map(DocumentWASM.createFromRawInstance)
    };
}
