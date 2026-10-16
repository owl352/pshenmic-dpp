import {
  DataContractWASM,
  PlatformVersionWASM,
  verifyChainedDocumentsProof,
  verifyCompositeDocumentsProof,
  verifyContractDocumentRemovalsProof,
  verifyContractFeePotsProof,
  verifyContractGroupInfoProof,
  verifyContractGroupMembersProof,
  verifyContractGroupMembershipsForContractProof,
  verifyContractModerationActionCountsProof,
  verifyContractModerationEntriesProof,
  verifyContractModerationStatusProof,
  verifyContractsByRangeProof,
  verifyContractsVersionsProof,
  verifyContractTeamActionSignatureProof,
  verifyContractTeamActionSignersProof,
  verifyContractTeamActionsProof,
  verifyHavingDocumentsProof,
  verifyIdentityKeysRemainingBudgetsProof,
  verifyRankedDocumentsProof
} from 'pshenmic-dpp'

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const V14 = PlatformVersionWASM.PLATFORM_V14

// Not a grovedb proof: every verifier must get past argument parsing and query building,
// then fail on the proof itself
const BAD_PROOF = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])

const ARGUMENT_ERRORS = /must be|needs a|unknown|not a known|does not fit|greater than max|one contract per sub-query/

function expectProofError (verify: () => unknown): void {
  let error: Error | undefined
  try {
    verify()
  } catch (e) {
    error = e as Error
  }

  expect(error).toBeDefined()
  expect(error?.message).not.toMatch(ARGUMENT_ERRORS)
}

function buildContract (): DataContractWASM {
  return new DataContractWASM(
    OWNER_ID,
    BigInt(1),
    {
      note: {
        type: 'object',
        properties: {
          message: { type: 'string', position: 0, maxLength: 63 },
          authorId: { type: 'array', byteArray: true, minItems: 32, maxItems: 32, contentMediaType: 'application/x.dash.dpp.identifier', position: 1 }
        },
        indices: [{ name: 'byMessage', properties: [{ message: 'asc' }] }],
        additionalProperties: false
      }
    },
    undefined,
    undefined,
    true,
    V14
  )
}

describe('Platform v5 verify', function () {
  describe('identity, contracts and contract groups', function () {
    test('should reach proof verification', function () {
      expectProofError(() => verifyIdentityKeysRemainingBudgetsProof(BAD_PROOF, OWNER_ID, [0, 1], false, V14))
      expectProofError(() => verifyContractsByRangeProof(BAD_PROOF, CONTRACT_ID, true, 10, false, V14))
      expectProofError(() => verifyContractsVersionsProof(BAD_PROOF, [CONTRACT_ID, OWNER_ID], V14))
      expectProofError(() => verifyContractGroupInfoProof(BAD_PROOF, CONTRACT_ID, V14))
      expectProofError(() => verifyContractGroupMembersProof(BAD_PROOF, CONTRACT_ID, { kind: 'contracts', startAfter: OWNER_ID }, 10, V14))
      expectProofError(() => verifyContractGroupMembersProof(BAD_PROOF, CONTRACT_ID, { kind: 'documentTypes', startAfter: [OWNER_ID, 'note'] }, 10, V14))
      expectProofError(() => verifyContractGroupMembersProof(BAD_PROOF, CONTRACT_ID, { kind: 'tokens' }, 10, V14))
      expectProofError(() => verifyContractGroupMembershipsForContractProof(BAD_PROOF, CONTRACT_ID, V14))
    })
  })

  describe('contract moderation', function () {
    test('should reach proof verification', function () {
      expectProofError(() => verifyContractDocumentRemovalsProof(BAD_PROOF, CONTRACT_ID, 'note', { documentIds: [OWNER_ID] }, false, V14))
      expectProofError(() => verifyContractDocumentRemovalsProof(BAD_PROOF, CONTRACT_ID, 'note', { startAfter: OWNER_ID, limit: 10 }, false, V14))
      expectProofError(() => verifyContractFeePotsProof(BAD_PROOF, CONTRACT_ID, ['owner', 'moderators'], false, V14))
      expectProofError(() => verifyContractModerationActionCountsProof(BAD_PROOF, CONTRACT_ID, false, V14))
      expectProofError(() => verifyContractModerationEntriesProof(BAD_PROOF, CONTRACT_ID, 'banlist', undefined, 10, V14))
      expectProofError(() => verifyContractModerationStatusProof(BAD_PROOF, CONTRACT_ID, OWNER_ID, ['banlist', 'suspensions', 'warnings'], false, V14))
      expectProofError(() => verifyContractTeamActionSignatureProof(BAD_PROOF, CONTRACT_ID, OWNER_ID, OWNER_ID, false, V14))
      expectProofError(() => verifyContractTeamActionSignersProof(BAD_PROOF, CONTRACT_ID, 'actionActive', OWNER_ID, false, V14))
      expectProofError(() => verifyContractTeamActionsProof(BAD_PROOF, CONTRACT_ID, 1, OWNER_ID, true, 10, false, V14))
    })

    test('should reject malformed arguments', function () {
      expect(() => verifyContractDocumentRemovalsProof(BAD_PROOF, CONTRACT_ID, 'note', {} as any, false, V14))
        .toThrow('selection needs documentIds or a limit')
      expect(() => verifyContractModerationEntriesProof(BAD_PROOF, CONTRACT_ID, 'blocklist' as any, undefined, 10, V14))
        .toThrow()
      expect(() => verifyContractFeePotsProof(BAD_PROOF, CONTRACT_ID, ['nobody' as any], false, V14))
        .toThrow('Invalid ContractFeePot value')
    })
  })

  describe('document queries', function () {
    // The test contract has no indexOnly, identifier-bound or ranked index: the queries reach
    // rs-drive's own validation of their shape, past our parsing
    test('should build chained and composite queries', function () {
      const contract = buildContract()

      expect(() => verifyChainedDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', where: [['message', '==', 'hi']], limit: 10 },
        'authorId', 'note', V14
      )).toThrow('chained document queries require an indexOnly inner document type')
      expect(() => verifyCompositeDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', where: [['message', 'startsWith', 'h']], orderBy: [['message', 'asc']], limit: 10 },
        [{ documentTypeName: 'note', kind: 'count', binding: { source: 'page', sourceProperty: 'message', field: 'message' } }],
        V14
      )).toThrow('composite bindings derive identifiers only')
    })

    test('should reject malformed document queries', function () {
      const contract = buildContract()

      expect(() => verifyChainedDocumentsProof(BAD_PROOF, contract, { documentTypeName: 'note', limit: 500 }, 'authorId', 'note', V14))
        .toThrow('greater than max limit')
      expect(() => verifyChainedDocumentsProof(BAD_PROOF, contract, { documentTypeName: 'missing', limit: 10 }, 'authorId', 'note', V14))
        .toThrow()
      expect(() => verifyCompositeDocumentsProof(
        BAD_PROOF, contract, { documentTypeName: 'note' },
        [{ documentTypeName: 'note', kind: 'sum' as any }], V14
      )).toThrow('unknown sub-query kind')
      expect(() => verifyRankedDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', select: { function: 'median' as any }, groupBy: ['message'] }, V14
      )).toThrow('select function must be one of')
      expect(() => verifyHavingDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', select: { function: 'count' }, groupBy: ['message'], having: [{ function: 'count', operator: '~' as any, value: 1 }] }, V14
      )).toThrow('unknown having operator')
    })

    test('should refuse ranked and having queries the contract has no ranked index for', function () {
      const contract = buildContract()

      expect(() => verifyRankedDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', select: { function: 'count' }, groupBy: ['message'], orderBy: [['$count', 'desc']], limit: 5 }, V14
      )).toThrow('rankedCountable')
      expect(() => verifyHavingDocumentsProof(
        BAD_PROOF, contract,
        { documentTypeName: 'note', select: { function: 'count' }, groupBy: ['message'], having: [{ function: 'count', operator: '>', value: 2 }], limit: 5 }, V14
      )).toThrow('rankedCountable')
    })
  })
})
