import { dppProvider } from '../../provider.js';
import { plainProofValue, valueToDynamicValue } from '../../utils.js';
/**
 * Verifies a having-range query: the groups of `groupBy` whose aggregate falls within the
 * `having` bounds. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyHavingDocumentsProof(proof, contract, query, platformVersion, metadataTimeMs) {
    const result = dppProvider.dpp.verifyHavingDocumentsProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], valueToDynamicValue(query.select), query.groupBy, valueToDynamicValue(query.having), query.limit, query.offset, valueToDynamicValue(platformVersion), metadataTimeMs?.toString());
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
