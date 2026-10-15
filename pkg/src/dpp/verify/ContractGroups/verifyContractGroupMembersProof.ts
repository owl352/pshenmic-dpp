import { dppProvider } from '../../provider.js'
import { ContractGroupMembersQuery, IdentifierLike, PlatformVersionLike, ProvenContractGroupMembers, VerifiedProof } from '../../types.js'
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

function membersQueryToPlain (query: ContractGroupMembersQuery): any {
  if (query.startAfter == null) {
    return { kind: query.kind }
  }

  if (query.kind === 'contracts') {
    return { kind: query.kind, startAfter: new IdentifierWASM(query.startAfter as any).bytes() }
  }

  const [id, rest] = query.startAfter
  return { kind: query.kind, startAfter: [new IdentifierWASM(id as any).bytes(), rest] }
}

function membersPageFromPlain (page: any): ProvenContractGroupMembers {
  if (page.kind === 'contracts') {
    return { kind: 'contracts', members: page.members.map(identifierFromBytes) }
  }

  return { kind: page.kind, members: page.members.map(([id, rest]: [Uint8Array, any]) => [identifierFromBytes(id), rest]) }
}

/** One kind of members of a contract group, paged in key order **/
export function verifyContractGroupMembersProof (
  proof: Uint8Array,
  contractGroupId: IdentifierLike,
  query: ContractGroupMembersQuery,
  limit: number,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractGroupMembers> {
  const result = dppProvider.dpp.verifyContractGroupMembersProof(
    proof,
    prepareIdentifierValue(contractGroupId),
    valueToDynamicValue(membersQueryToPlain(query)),
    limit,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: membersPageFromPlain(valueFromDynamicValue(result.value))
  }
}
