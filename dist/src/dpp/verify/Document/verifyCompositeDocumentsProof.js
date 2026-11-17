import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { DocumentWASM } from '../../structs/Document.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
/**
 * Verifies a composite query: a page plus up to 10 sub-queries, each optionally bound to
 * values the page or an earlier sub-query proved
 **/
export function verifyCompositeDocumentsProof(proof, contract, query, subQueries, platformVersion) {
    const result = dppProvider.dpp.verifyCompositeDocumentsProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], query.limit, query.offset, query.startAt != null ? prepareIdentifierValue(query.startAt) : undefined, query.startAtIncluded ?? false, subQueries.map(({ dataContract, ...subQuery }) => valueToDynamicValue(subQuery)), subQueries.map(subQuery => (subQuery.dataContract ?? contract)._rawDataContract), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        pageDocuments: result.pageDocuments.map(DocumentWASM.createFromRawInstance),
        subResults: result.subResults.map(subResult => ({
            documents: subResult.documents?.map(DocumentWASM.createFromRawInstance),
            counts: subResult.counts != null ? plainProofValue(subResult.counts) : undefined,
            missingIds: subResult.missingIds.map(IdentifierWASM.createFromRawInstance),
            removals: plainProofValue(subResult.removals)
        }))
    };
}
