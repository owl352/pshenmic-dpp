import {
  DocumentEraseTransitionWASM,
  DocumentWASM,
  IdentifierWASM,
  PlatformVersionWASM,
  TokenTradeModeWASM,
  VotePollWASM,
  VoteWASM,
  YesNoMinimumVotingPowerWASM,
  dpp as rawDpp
} from 'pshenmic-dpp'

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const DOCUMENT_TYPE = 'note'

function randomBytes (length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = (i * 37 + 11) % 256
  }
  return bytes
}

function randomIdentifier (): IdentifierWASM {
  return IdentifierWASM.fromBytes(randomBytes(32))
}

function createDocument (): DocumentWASM {
  return new DocumentWASM(
    { message: 'hello' },
    DOCUMENT_TYPE,
    BigInt(1),
    CONTRACT_ID,
    OWNER_ID
  )
}

describe('Platform v5.1 (protocol version 15)', function () {
  test('exposes PLATFORM_V15', function () {
    expect(PlatformVersionWASM.PLATFORM_V15).toBe(15)
  })

  describe('document erase', function () {
    test('builds an erase transition and reports its action type', function () {
      const document = createDocument()
      const erase = new DocumentEraseTransitionWASM(document, BigInt(3))

      const transition = erase.toDocumentTransition()

      expect(transition.actionType).toEqual('Erase')
      expect(transition.actionTypeNumber).toEqual(8)
      expect(transition.documentTypeName).toEqual(DOCUMENT_TYPE)
      expect(transition.identityContractNonce).toEqual(BigInt(3))
      expect(transition.dataContractId.base58()).toEqual(CONTRACT_ID)
    })

    test('round-trips through the document transition', function () {
      const erase = new DocumentEraseTransitionWASM(createDocument(), BigInt(4))
      const recovered = DocumentEraseTransitionWASM.fromDocumentTransition(erase.toDocumentTransition())

      expect(recovered.base.id.base58()).toEqual(erase.base.id.base58())
      expect(recovered.base.identityContractNonce).toEqual(BigInt(4))
    })
  })

  describe('tradeable tokens', function () {
    test('exposes the Tradeable trade mode', function () {
      expect(TokenTradeModeWASM.Tradeable().getValue()).toEqual('Tradeable')
      expect(TokenTradeModeWASM.NotTradeable().getValue()).toEqual('NotTradeable')
    })
  })

  describe('yes/no vote polls', function () {
    test('builds a decision proposal poll with an absolute minimum', function () {
      const documentId = randomIdentifier()
      const poll = VotePollWASM.fromYesNoDecisionProposal(
        documentId,
        2,
        3,
        YesNoMinimumVotingPowerWASM.Absolute(400)
      )

      expect(poll.kind).toEqual('yesNoVotePoll')
      expect(poll.purposeDocumentId.base58()).toEqual(documentId.base58())
      expect(poll.supermajorityNumerator).toEqual(2)
      expect(poll.supermajorityDenominator).toEqual(3)
      expect(poll.minimumVotingPower.type).toEqual('absolute')
      expect(poll.minimumVotingPower.votingPower).toEqual(400)
      expect(poll.minimumVotingPower.numerator).toBeUndefined()
    })

    test('builds a fractional minimum and round-trips the poll bytes', function () {
      const documentId = randomIdentifier()
      const poll = VotePollWASM.fromYesNoDecisionProposal(
        documentId,
        1,
        2,
        YesNoMinimumVotingPowerWASM.FractionOfTotal(1, 3, 'downPlusOne')
      )

      expect(poll.minimumVotingPower.type).toEqual('fractionOfTotal')
      expect(poll.minimumVotingPower.numerator).toEqual(1)
      expect(poll.minimumVotingPower.denominator).toEqual(3)
      expect(poll.minimumVotingPower.rounding).toEqual('downPlusOne')

      const recovered = VotePollWASM.fromBytes(poll.bytes())

      expect(recovered.kind).toEqual('yesNoVotePoll')
      expect(recovered.purposeDocumentId.base58()).toEqual(documentId.base58())
    })

    test('keeps the contested poll constructor and its getters', function () {
      const contractId = randomIdentifier()
      const poll = new VotePollWASM(contractId, DOCUMENT_TYPE, 'index', ['value'])

      expect(poll.kind).toEqual('contestedDocumentResourceVotePoll')
      expect(poll.contractId.base58()).toEqual(contractId.base58())
      expect(poll.documentTypeName).toEqual(DOCUMENT_TYPE)
      expect(poll.indexName).toEqual('index')

      expect(() => poll.purposeDocumentId).toThrow()
    })
  })

  describe('yes/no votes', function () {
    test('builds a yes/no vote naming its poll by id', function () {
      const pollId = randomIdentifier()
      const vote = VoteWASM.fromYesNo(pollId, 'yes')

      expect(vote.pollId.base58()).toEqual(pollId.base58())
      expect(vote.yesNoChoice).toEqual('yes')
    })

    test('supports changing the answer and refuses resource-only getters', function () {
      const vote = VoteWASM.fromYesNo(randomIdentifier(), 'no')

      vote.yesNoChoice = 'abstain'
      vote.pollId = randomIdentifier()

      expect(vote.yesNoChoice).toEqual('abstain')
      expect(() => vote.votePoll).toThrow()
      expect(() => vote.resourceVoteChoice).toThrow()
    })
  })

  describe('private document entries', function () {
    test('builds and serializes a private document transition', function () {
      const documentId = randomIdentifier()
      const dataContractId = randomIdentifier()

      const transition = new rawDpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI(
        new rawDpp.DynamicValue(dataContractId.base58()),
        DOCUMENT_TYPE,
        [randomBytes(40), randomBytes(48)],
        [],
        '5000',
        randomBytes(32),
        new Uint8Array(),
        randomBytes(64)
      )

      expect(transition.dataContractId instanceof rawDpp.IdentifierNAPI).toBe(true)
      expect(transition.dataContractId.base58()).toEqual(dataContractId.base58())
      expect(transition.documentTypeName).toEqual(DOCUMENT_TYPE)
      expect(transition.entries.length).toEqual(2)
      expect(transition.valueBalance).toEqual('5000')

      const bytes = transition.bytes()
      const recovered = rawDpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI.fromBytes(bytes)

      expect(recovered.dataContractId.base58()).toEqual(dataContractId.base58())
      expect(recovered.entries.length).toEqual(2)
      expect(recovered.documentTypeName).toEqual(DOCUMENT_TYPE)
    })

    test('computes a fee that includes the entries', function () {
      const baseFee = BigInt(
        rawDpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(2, 0, 0)
      )
      const withEntries = BigInt(
        rawDpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(2, 2, 40)
      )

      expect(baseFee > BigInt(0)).toBe(true)
      expect(withEntries > baseFee).toBe(true)
    })
  })
})
