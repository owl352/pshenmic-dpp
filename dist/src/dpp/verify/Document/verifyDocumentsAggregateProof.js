import { dppProvider } from '../../provider.js';
import { plainProofValue, valueToDynamicValue } from '../../utils.js';
function toVerifiedAggregate(result) {
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
/**
 * Verifies a `COUNT(*)` documents query. Without `groupBy` the single entry is the total; grouped by an
 * `In` and/or range field there is one entry per group. The proof primitive is resolved from the query
 * the way drive picks it. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE`
 * selections
 **/
export function verifyDocumentsCountProof(proof, contract, query, platformVersion, metadataTimeMs) {
    return toVerifiedAggregate(dppProvider.dpp.verifyDocumentsCountProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], query.groupBy ?? [], query.limit, valueToDynamicValue(platformVersion), metadataTimeMs?.toString()));
}
/**
 * Verifies a `SUM(field)` documents query: one entry with the total without `groupBy`, one per group with it.
 * `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyDocumentsSumProof(proof, contract, query, field, platformVersion, metadataTimeMs) {
    return toVerifiedAggregate(dppProvider.dpp.verifyDocumentsSumProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], query.groupBy ?? [], field, query.limit, valueToDynamicValue(platformVersion), metadataTimeMs?.toString()));
}
/**
 * Verifies an `AVG(field)` documents query: each entry carries the proved `count` and `sum`, the average
 * being `sum / count`. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyDocumentsAverageProof(proof, contract, query, field, platformVersion, metadataTimeMs) {
    return toVerifiedAggregate(dppProvider.dpp.verifyDocumentsAverageProof(proof, contract._rawDataContract, query.documentTypeName, valueToDynamicValue(query.where), query.orderBy ?? [], query.groupBy ?? [], field, query.limit, valueToDynamicValue(platformVersion), metadataTimeMs?.toString()));
}
