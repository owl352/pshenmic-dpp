import { dppProvider } from '../../provider.js';
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
function membersQueryToPlain(query) {
    if (query.startAfter == null) {
        return { kind: query.kind };
    }
    if (query.kind === 'contracts') {
        return { kind: query.kind, startAfter: new IdentifierWASM(query.startAfter).bytes() };
    }
    const [id, rest] = query.startAfter;
    return { kind: query.kind, startAfter: [new IdentifierWASM(id).bytes(), rest] };
}
function membersPageFromPlain(page) {
    if (page.kind === 'contracts') {
        return { kind: 'contracts', members: page.members.map(identifierFromBytes) };
    }
    return { kind: page.kind, members: page.members.map(([id, rest]) => [identifierFromBytes(id), rest]) };
}
/** One kind of members of a contract group, paged in key order **/
export function verifyContractGroupMembersProof(proof, contractGroupId, query, limit, platformVersion) {
    const result = dppProvider.dpp.verifyContractGroupMembersProof(proof, prepareIdentifierValue(contractGroupId), valueToDynamicValue(membersQueryToPlain(query)), limit, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: membersPageFromPlain(valueFromDynamicValue(result.value))
    };
}
