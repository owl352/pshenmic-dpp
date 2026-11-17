import { dppProvider } from '../../provider.js';
import { plainProofValue, valueToDynamicValue } from '../../utils.js';
/**
 * Verifies a ranked (top-k) query: the groups of `groupBy` ranked by `select`'s aggregate.
 * `orderBy` orders by the aggregate itself: `[['$count' | '$sum' | '$avg', 'desc' | 'asc']]`.
 * The contract needs a ranked index (meta-schema v3). `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyRankedDocumentsProof(proof, contract, query, platformVersion, metadataTimeMs) {
    const result = dppProvider.dpp.verifyRankedDocumentsProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], valueToDynamicValue(query.select), query.groupBy, query.limit, query.offset, valueToDynamicValue(platformVersion), metadataTimeMs?.toString());
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
