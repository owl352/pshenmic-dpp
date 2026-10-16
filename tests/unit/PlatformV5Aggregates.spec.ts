import {
  AgreedFeeMultiplierWASM,
  BatchType,
  DataContractWASM,
  DocumentActionFeeAgreementWASM,
  DocumentBaseTransitionWASM,
  DocumentCreateTransitionWASM,
  DocumentWASM,
  PlatformVersionWASM,
  verifyDocumentsAverageProof,
  verifyDocumentsCountProof,
  verifyDocumentsProof,
  verifyDocumentsSumProof,
  verifyRankedDocumentsProof
} from 'pshenmic-dpp'

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const DOCUMENT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const V14 = PlatformVersionWASM.PLATFORM_V14

// Not a grovedb proof: a verifier that resolved its mode, index and windows fails on the proof
const BAD_PROOF = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])

const ARGUMENT_ERRORS = /must be|needs a|needs metadataTimeMs|unknown|not a known|does not fit|no summable index|needs a countable|needs a rangeCountable|not supported|is required|not a window start/

function thrownBy (verify: () => unknown): Error | undefined {
  try {
    verify()
  } catch (e) {
    return e as Error
  }
}

function expectProofError (verify: () => unknown): void {
  const error = thrownBy(verify)

  expect(error).toBeDefined()
  expect(error?.message).not.toMatch(ARGUMENT_ERRORS)
}

function expectArgumentError (verify: () => unknown, message: RegExp): void {
  const error = thrownBy(verify)

  expect(error).toBeDefined()
  expect(error?.message).toMatch(message)
}

const HOUR_SECONDS = 3_600
const STEP_MS = BigInt(2 * HOUR_SECONDS * 1000)
// A multiple of the two-hour step, so a window start on the phase-0 grid
const WINDOW_START_MS = BigInt(1_755_000_000_000)

function buildContract (): DataContractWASM {
  return new DataContractWASM(
    OWNER_ID,
    BigInt(1),
    {
      post: {
        type: 'object',
        documentsCountable: true,
        properties: {
          hashtag: { type: 'string', position: 0, maxLength: 63 },
          score: { type: 'integer', position: 1, minimum: 0, maximum: 1000 }
        },
        indices: [
          { name: 'byHashtag', properties: [{ hashtag: 'asc' }], countable: true, summable: 'score' },
          {
            name: 'trending',
            properties: [{ $createdAt: 'asc' }, { hashtag: 'asc' }],
            countable: true,
            timeRange: { on: '$createdAt', range: 6 * HOUR_SECONDS, step: 2 * HOUR_SECONDS, phase: 0 }
          }
        ],
        required: ['$createdAt', 'hashtag', 'score'],
        actionFees: {
          pricing: 'feeMultiplier',
          create: { owner: 10_000_000, moderators: 0 },
          delete: { owner: 5 }
        },
        additionalProperties: false
      }
    },
    undefined,
    undefined,
    true,
    V14
  )
}

describe('Platform v5 aggregates and action fees', function () {
  describe('document action fee agreement', function () {
    test('should agree to the fee the document type declares', function () {
      const contract = buildContract()
      const multiplier = new AgreedFeeMultiplierWASM(BigInt(1000), 20)

      const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(contract, 'post', 'create', multiplier)

      expect(agreement).toBeDefined()
      expect(agreement?.owner).toEqual(BigInt(10_000_000))
      expect(agreement?.moderators).toEqual(BigInt(0))
      expect(agreement?.pricing).toEqual('feeMultiplier')
      expect(agreement?.feeMultiplier?.knownPermille).toEqual(BigInt(1000))
      expect(agreement?.verify(contract, 'post', BatchType.Create)).toBe(true)
    })

    test('should need no agreement for an action that charges nothing', function () {
      const contract = buildContract()
      const multiplier = new AgreedFeeMultiplierWASM(BigInt(1000), 0)

      expect(DocumentActionFeeAgreementWASM.forDocumentTypeAction(contract, 'post', 'replace', multiplier)).toBeUndefined()
    })

    test('should refuse an agreement off the declared fee', function () {
      const contract = buildContract()
      const multiplier = new AgreedFeeMultiplierWASM(BigInt(1000), 20)

      const lowerOwner = new DocumentActionFeeAgreementWASM(BigInt(9_999_999), BigInt(0), multiplier)
      expect(lowerOwner.verify(contract, 'post', 'create')).toBe(false)

      const fixedPricing = new DocumentActionFeeAgreementWASM(BigInt(10_000_000), BigInt(0))
      expect(fixedPricing.verify(contract, 'post', 'create')).toBe(false)
    })

    test('should check the current fee multiplier against the agreed tolerance', function () {
      const contract = buildContract()
      const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(
        contract, 'post', 'create', new AgreedFeeMultiplierWASM(BigInt(1000), 20)
      )

      expect(agreement?.feeMultiplier?.tolerates(BigInt(1200))).toBe(true)
      expect(agreement?.feeMultiplier?.tolerates(BigInt(1201))).toBe(false)
      expect(agreement?.verify(contract, 'post', 'create', BigInt(1200))).toBe(true)
      expect(agreement?.verify(contract, 'post', 'create', BigInt(1201))).toBe(false)
    })

    test('should make the document base V2 only with an agreement', function () {
      const contract = buildContract()
      const agreement = new DocumentActionFeeAgreementWASM(BigInt(10_000_000), BigInt(0), new AgreedFeeMultiplierWASM(BigInt(1000), 20))

      const plain = new DocumentBaseTransitionWASM(DOCUMENT_ID, BigInt(1), 'post', contract.id)
      expect(plain.featureVersion).toEqual(1)
      expect(plain.actionFeeAgreement).toBeUndefined()

      const agreed = new DocumentBaseTransitionWASM(DOCUMENT_ID, BigInt(1), 'post', contract.id, undefined, agreement)
      expect(agreed.featureVersion).toEqual(2)
      expect(agreed.actionFeeAgreement?.owner).toEqual(BigInt(10_000_000))
    })

    test('should upgrade a V1 base when an agreement is set, keeping its fields', function () {
      const contract = buildContract()
      const base = new DocumentBaseTransitionWASM(DOCUMENT_ID, BigInt(7), 'post', contract.id)

      base.actionFeeAgreement = new DocumentActionFeeAgreementWASM(BigInt(10_000_000), BigInt(0))

      expect(base.featureVersion).toEqual(2)
      expect(base.identityContractNonce).toEqual(BigInt(7))
      expect(base.documentTypeName).toEqual('post')
      expect(base.id.base58()).toEqual(DOCUMENT_ID)
      expect(base.actionFeeAgreement?.pricing).toEqual('fixed')

      base.actionFeeAgreement = undefined
      expect(base.actionFeeAgreement).toBeUndefined()
    })

    test('should carry the agreement through a document transition', function () {
      const contract = buildContract()
      const document = new DocumentWASM({ hashtag: 'dash', score: 1 }, 'post', BigInt(1), contract.id, OWNER_ID)
      const agreement = DocumentActionFeeAgreementWASM.forDocumentTypeAction(
        contract, 'post', 'create', new AgreedFeeMultiplierWASM(BigInt(1000), 20)
      )

      const create = new DocumentCreateTransitionWASM(document, BigInt(1), undefined, undefined, agreement)

      expect(create.base.featureVersion).toEqual(2)
      expect(create.base.actionFeeAgreement?.owner).toEqual(BigInt(10_000_000))
      expect(new DocumentCreateTransitionWASM(document, BigInt(1)).base.featureVersion).toEqual(1)
    })
  })

  describe('count / sum / average proofs', function () {
    test('should resolve every count shape to a proof primitive', function () {
      const contract = buildContract()

      // documentsCountable, no filter: the primary-key count tree
      expectProofError(() => verifyDocumentsCountProof(BAD_PROOF, contract, { documentTypeName: 'post' }, V14))
      // equality: point lookup
      expectProofError(() => verifyDocumentsCountProof(BAD_PROOF, contract, {
        documentTypeName: 'post', where: [['hashtag', '==', 'dash']]
      }, V14))
      // grouped by an In
      expectProofError(() => verifyDocumentsCountProof(BAD_PROOF, contract, {
        documentTypeName: 'post', where: [['hashtag', 'in', ['dash', 'evo']]], groupBy: ['hashtag']
      }, V14))
    })

    test('should resolve sum and average to a summable index', function () {
      const contract = buildContract()
      const query = { documentTypeName: 'post', where: [['hashtag', '==', 'dash']] as any }

      expectProofError(() => verifyDocumentsSumProof(BAD_PROOF, contract, query, 'score', V14))
      expectProofError(() => verifyDocumentsAverageProof(BAD_PROOF, contract, query, 'score', V14))
    })

    test('should refuse a sum no index covers', function () {
      const contract = buildContract()

      expectArgumentError(
        () => verifyDocumentsSumProof(BAD_PROOF, contract, { documentTypeName: 'post', where: [['hashtag', '==', 'dash']] }, 'hashtag', V14),
        /no summable index/
      )
    })

    test('should refuse a group by no clause constrains', function () {
      const contract = buildContract()

      expectArgumentError(
        () => verifyDocumentsCountProof(BAD_PROOF, contract, { documentTypeName: 'post', groupBy: ['hashtag'] }, V14),
        /not supported/
      )
    })
  })

  describe('window selections', function () {
    const newestTrending = { documentTypeName: 'post', where: [['$createdAt', 'IN_TIME_RANGE', 'newest'], ['hashtag', '==', 'dash']] as any }

    test('should resolve a time range against the metadata time', function () {
      const contract = buildContract()

      expectProofError(() => verifyDocumentsCountProof(BAD_PROOF, contract, newestTrending, V14, WINDOW_START_MS + BigInt(1)))
      expectProofError(() => verifyDocumentsCountProof(BAD_PROOF, contract, {
        documentTypeName: 'post',
        where: [['$createdAt', 'IN_TIME_RANGE', { selector: 'byStart', startMs: WINDOW_START_MS }], ['hashtag', '==', 'dash']]
      }, V14, WINDOW_START_MS + STEP_MS))
    })

    test('should need the metadata time for a time range', function () {
      const contract = buildContract()

      expectArgumentError(() => verifyDocumentsCountProof(BAD_PROOF, contract, newestTrending, V14), /needs metadataTimeMs/)
    })

    test('should refuse a window start off the grid', function () {
      const contract = buildContract()

      expectArgumentError(() => verifyDocumentsCountProof(BAD_PROOF, contract, {
        documentTypeName: 'post',
        where: [['$createdAt', 'IN_TIME_RANGE', { selector: 'byStart', startMs: WINDOW_START_MS + BigInt(1) }], ['hashtag', '==', 'dash']]
      }, V14, WINDOW_START_MS + STEP_MS), /not a window start/)
    })

    test('should refuse a time range on a field no grid buckets', function () {
      const contract = buildContract()

      expectArgumentError(() => verifyDocumentsCountProof(BAD_PROOF, contract, {
        documentTypeName: 'post', where: [['$updatedAt', 'IN_TIME_RANGE', 'newest']]
      }, V14, WINDOW_START_MS), /no time-range index/)
    })

    test('should resolve windows on documents and ranked queries', function () {
      const contract = buildContract()

      expectProofError(() => verifyDocumentsProof(
        BAD_PROOF, contract, 'post', newestTrending.where, undefined, 10, undefined, false, undefined, V14, WINDOW_START_MS + BigInt(1)
      ))
      expectArgumentError(() => verifyDocumentsProof(
        BAD_PROOF, contract, 'post', newestTrending.where, undefined, 10, undefined, false, undefined, V14
      ), /needs metadataTimeMs/)
      expectArgumentError(() => verifyRankedDocumentsProof(BAD_PROOF, contract, {
        documentTypeName: 'post', select: { function: 'count' }, groupBy: ['hashtag'], where: newestTrending.where.slice(0, 1)
      }, V14), /needs metadataTimeMs/)
    })
  })
})
