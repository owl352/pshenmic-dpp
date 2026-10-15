import {
  ContractBoundsWASM,
  ContractFeeClaimTransitionWASM,
  ContractFeePot,
  ContractUserModerationTransitionWASM,
  DataContractCreateTransitionWASM,
  DataContractWASM,
  DocumentIndexOnlyDeleteTransitionWASM,
  DocumentTransitionWASM,
  DocumentWASM,
  IdentifierWASM,
  IdentityKeyLimitsUpdateTransitionWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityPublicKeyWASM,
  IdentityTopUpFromShieldedPoolTransitionWASM,
  KeyType,
  PlatformVersionWASM,
  Purpose,
  SecurityLevel,
  SerializedActionWASM,
  ShieldFromIdentityTransitionWASM,
  StateTransitionWASM,
  TokenBaseTransitionWASM,
  TokenBurnFromPoolTransitionWASM,
  TokenClaimToPoolTransitionWASM,
  TokenDirectPurchaseToPoolTransitionWASM,
  TokenDistributionRulesWASM,
  TokenMintToPoolTransitionWASM,
  TokenPaymentInfoWASM,
  TokenPurchaseFromShieldedPoolTransitionWASM,
  TokenShieldedPaymentWASM,
  TokenShieldedTransferTransitionWASM,
  TokenShieldedTransferWithShieldedFeeTransitionWASM,
  TokenShieldTransitionWASM,
  TokenTransitionWASM,
  TokenUnshieldTransitionWASM,
  TokenUnshieldWithShieldedFeeTransitionWASM
} from 'pshenmic-dpp'
import { buildChangeControlRules } from './utils/buildTokenConfiguration.js'

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const TOKEN_ID = 'H7FRpZJqZK933r9CzZMsCuf1BM34NT5P2wSJyjDkprqy'
const KEY_DATA = '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'

function randomBytes (length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

function createTestAction (): SerializedActionWASM {
  return new SerializedActionWASM(
    randomBytes(32),
    randomBytes(32),
    randomBytes(32),
    randomBytes(580),
    randomBytes(32),
    randomBytes(64)
  )
}

function roundTrip (stateTransition: StateTransitionWASM): StateTransitionWASM {
  return StateTransitionWASM.fromBytes(stateTransition.bytes())
}

describe('Platform v5', function () {
  describe('IdentityPublicKey limits', function () {
    test('should create a key with a budget and an expiry', function () {
      const key = new IdentityPublicKeyWASM(
        0, Purpose.AUTHENTICATION, SecurityLevel.HIGH, KeyType.ECDSA_SECP256K1, false, KEY_DATA,
        undefined, undefined, BigInt(5000), BigInt(1700000000000)
      )

      expect(key.totalBudget).toEqual(BigInt(5000))
      expect(key.expiresAt).toEqual(BigInt(1700000000000))
      expect(key.hasLimits()).toEqual(true)
      expect(key.isExpiredAt(BigInt(1700000000000))).toEqual(true)
      expect(key.isExpiredAt(1699999999999)).toEqual(false)

      const restored = IdentityPublicKeyWASM.fromBytes(key.bytes())

      expect(restored.totalBudget).toEqual(BigInt(5000))
      expect(restored.expiresAt).toEqual(BigInt(1700000000000))
    })

    test('should upgrade a key without limits when a limit is set', function () {
      const key = new IdentityPublicKeyWASM(
        0, Purpose.AUTHENTICATION, SecurityLevel.HIGH, KeyType.ECDSA_SECP256K1, false, KEY_DATA
      )
      const v0Length = key.bytes().length

      expect(key.hasLimits()).toEqual(false)
      expect(key.totalBudget).toEqual(undefined)

      key.totalBudget = BigInt(100)
      key.contractBounds = ContractBoundsWASM.SingleContract(CONTRACT_ID)

      expect(key.totalBudget).toEqual(BigInt(100))
      expect(key.expiresAt).toEqual(undefined)
      expect(key.contractBounds).toBeDefined()
      expect(key.bytes().length).toBeGreaterThan(v0Length)

      key.totalBudget = undefined

      expect(key.hasLimits()).toEqual(false)
    })

    test('should keep the limits of a key in creation', function () {
      const key = new IdentityPublicKeyInCreationWASM(
        1, Purpose.AUTHENTICATION, SecurityLevel.HIGH, KeyType.ECDSA_SECP256K1, false,
        Buffer.from(KEY_DATA, 'hex'), undefined, undefined, undefined, BigInt(1700000000000)
      )

      expect(key.totalBudget).toEqual(undefined)
      expect(key.expiresAt).toEqual(BigInt(1700000000000))

      key.totalBudget = BigInt(42)

      const publicKey = key.toIdentityPublicKey()

      expect(publicKey.totalBudget).toEqual(BigInt(42))
      expect(publicKey.expiresAt).toEqual(BigInt(1700000000000))
    })
  })

  describe('DocumentIndexOnlyDeleteTransition', function () {
    test('should carry the document properties and convert to a document transition', function () {
      const document = new DocumentWASM({ label: 'alice' }, 'note', BigInt(1), CONTRACT_ID, OWNER_ID)

      const transition = new DocumentIndexOnlyDeleteTransitionWASM(document, BigInt(3))

      expect(transition.data).toEqual({ label: 'alice' })
      expect(transition.base.identityContractNonce).toEqual(BigInt(3))

      const documentTransition = new DocumentTransitionWASM(transition)

      expect(documentTransition.actionType).toEqual('IndexOnlyDelete')
      expect(documentTransition.indexOnlyDeleteTransition.data).toEqual({ label: 'alice' })
      expect(DocumentIndexOnlyDeleteTransitionWASM.fromDocumentTransition(documentTransition).data)
        .toEqual({ label: 'alice' })
    })
  })

  describe('TokenPaymentInfo', function () {
    test('should set and clear a shielded payment', function () {
      const paymentInfo = new TokenPaymentInfoWASM(undefined, 0, BigInt(1), BigInt(10))
      const anchor = randomBytes(32)
      const payment = new TokenShieldedPaymentWASM(BigInt(7), [createTestAction()], anchor, randomBytes(192), randomBytes(64))

      expect(paymentInfo.shieldedPayment).toEqual(undefined)

      paymentInfo.shieldedPayment = payment

      expect(paymentInfo.shieldedPayment?.amount).toEqual(BigInt(7))
      expect(paymentInfo.shieldedPayment?.anchor).toEqual(anchor)
      expect(paymentInfo.shieldedPayment?.actions.length).toEqual(1)

      paymentInfo.shieldedPayment = undefined

      expect(paymentInfo.shieldedPayment).toEqual(undefined)
    })

    test('should set the minimum token cost', function () {
      const paymentInfo = new TokenPaymentInfoWASM(undefined, 0, BigInt(1), BigInt(10))

      paymentInfo.minimumTokenCost = BigInt(5)

      expect(paymentInfo.minimumTokenCost).toEqual(BigInt(5))
      expect(paymentInfo.maximumTokenCost).toEqual(BigInt(10))
    })
  })

  describe('TokenDistributionRules', function () {
    test('should set a once-per-identity distribution', function () {
      const rules = new TokenDistributionRulesWASM(
        buildChangeControlRules(),
        buildChangeControlRules(),
        false,
        buildChangeControlRules(),
        buildChangeControlRules(),
        undefined,
        undefined,
        undefined,
        BigInt(2500)
      )

      expect(rules.oncePerIdentityDistributionAmount).toEqual(BigInt(2500))

      rules.oncePerIdentityDistributionAmount = undefined

      expect(rules.oncePerIdentityDistributionAmount).toEqual(undefined)
    })
  })

  describe('DataContractCreateTransition contract groups', function () {
    test('should register a contract group and memberships', function () {
      const contract = new DataContractWASM(
        OWNER_ID,
        BigInt(1),
        { note: { type: 'object', properties: { message: { type: 'string', position: 0 } }, additionalProperties: false } },
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V14
      )
      const transition = new DataContractCreateTransitionWASM(contract, BigInt(1), PlatformVersionWASM.PLATFORM_V14)

      expect(transition.contractGroup).toEqual(undefined)
      expect(transition.contractGroupId).toEqual(undefined)
      expect(transition.contractGroupMemberships).toEqual([])

      transition.contractGroup = { admins: [], name: 'team', description: null }
      transition.contractGroupMemberships = [{ contractGroupId: CONTRACT_ID, member: 'contract' }]

      expect(transition.contractGroup?.name).toEqual('team')
      expect(transition.contractGroupId).toBeInstanceOf(IdentifierWASM)
      expect(transition.contractGroupMemberships.length).toEqual(1)
      expect(transition.contractGroupMemberships[0].member).toEqual('contract')

      const restored = DataContractCreateTransitionWASM.fromStateTransition(roundTrip(transition.toStateTransition()))

      expect(restored.contractGroup?.name).toEqual('team')
      expect(restored.contractGroupId?.base58()).toEqual(transition.contractGroupId?.base58())
    })
  })

  describe('state transitions', function () {
    test('IdentityKeyLimitsUpdateTransition', function () {
      const transition = new IdentityKeyLimitsUpdateTransitionWASM(OWNER_ID, BigInt(2), 1, BigInt(1000), undefined)

      expect(transition.identityId.base58()).toEqual(OWNER_ID)
      expect(transition.totalBudget).toEqual(BigInt(1000))
      expect(transition.expiresAt).toEqual(undefined)

      transition.expiresAt = BigInt(1700000000000)

      const stateTransition = roundTrip(transition.toStateTransition())

      expect(stateTransition.getActionType()).toEqual('IDENTITY_KEY_LIMITS_UPDATE')

      const restored = IdentityKeyLimitsUpdateTransitionWASM.fromStateTransition(stateTransition)

      expect(restored.keyId).toEqual(1)
      expect(restored.nonce).toEqual(BigInt(2))
      expect(restored.expiresAt).toEqual(BigInt(1700000000000))
    })

    test('ContractUserModerationTransition', function () {
      const transition = new ContractUserModerationTransitionWASM(OWNER_ID, CONTRACT_ID, BigInt(4), {
        $type: 'suspend',
        identityId: TOKEN_ID,
        until: 1700000000000,
        reason: { code: 3, text: 'spam' }
      })

      const restored = ContractUserModerationTransitionWASM.fromStateTransition(roundTrip(transition.toStateTransition()))
      const action = restored.action

      expect(restored.dataContractId.base58()).toEqual(CONTRACT_ID)
      expect(restored.identityContractNonce).toEqual(BigInt(4))
      expect(action.$type).toEqual('suspend')
      expect(action.$type === 'suspend' && action.reason.text).toEqual('spam')
      expect(action.$type === 'suspend' && new IdentifierWASM(action.identityId).base58()).toEqual(TOKEN_ID)
    })

    test('ContractFeeClaimTransition', function () {
      const transition = new ContractFeeClaimTransitionWASM(OWNER_ID, CONTRACT_ID, BigInt(1), 'moderators')

      expect(transition.pot).toEqual('Moderators')

      transition.pot = ContractFeePot.Owner

      const restored = ContractFeeClaimTransitionWASM.fromStateTransition(roundTrip(transition.toStateTransition()))

      expect(restored.pot).toEqual('Owner')
      expect(restored.ownerId.base58()).toEqual(OWNER_ID)
    })

    test('ShieldFromIdentityTransition', function () {
      const anchor = randomBytes(32)
      const transition = new ShieldFromIdentityTransitionWASM(
        OWNER_ID, BigInt(50000), [createTestAction()], anchor, randomBytes(192), randomBytes(64), BigInt(9)
      )

      const restored = ShieldFromIdentityTransitionWASM.fromStateTransition(roundTrip(transition.toStateTransition()))

      expect(restored.amount).toEqual(BigInt(50000))
      expect(restored.anchor).toEqual(anchor)
      expect(restored.nonce).toEqual(BigInt(9))
      expect(restored.actions.length).toEqual(1)
    })

    test('IdentityTopUpFromShieldedPoolTransition', function () {
      const transition = new IdentityTopUpFromShieldedPoolTransitionWASM(
        OWNER_ID, [createTestAction()], BigInt(777), randomBytes(32), randomBytes(192), randomBytes(64)
      )

      const restored = IdentityTopUpFromShieldedPoolTransitionWASM.fromStateTransition(roundTrip(transition.toStateTransition()))

      expect(restored.topUpAmount).toEqual(BigInt(777))
      expect(restored.identityId.base58()).toEqual(OWNER_ID)
    })

    test('token shielded fee transitions', function () {
      const fee = (): [SerializedActionWASM[], Uint8Array, Uint8Array, Uint8Array, bigint] =>
        [[createTestAction()], randomBytes(32), randomBytes(192), randomBytes(64), BigInt(123)]
      const tokenBundle = (): [SerializedActionWASM[], Uint8Array, Uint8Array, Uint8Array] =>
        [[createTestAction()], randomBytes(32), randomBytes(192), randomBytes(64)]

      const transfer = new TokenShieldedTransferWithShieldedFeeTransitionWASM(
        CONTRACT_ID, 0, TOKEN_ID, ...tokenBundle(), ...fee()
      )
      const unshield = new TokenUnshieldWithShieldedFeeTransitionWASM(
        CONTRACT_ID, 0, TOKEN_ID, OWNER_ID, BigInt(10), ...tokenBundle(), ...fee()
      )
      const purchase = new TokenPurchaseFromShieldedPoolTransitionWASM(
        CONTRACT_ID, 0, TOKEN_ID, BigInt(5), BigInt(5000), ...tokenBundle(), ...fee()
      )

      expect(TokenShieldedTransferWithShieldedFeeTransitionWASM.fromStateTransition(roundTrip(transfer.toStateTransition())).creditAmount)
        .toEqual(BigInt(123))
      expect(TokenUnshieldWithShieldedFeeTransitionWASM.fromStateTransition(roundTrip(unshield.toStateTransition())).recipientId.base58())
        .toEqual(OWNER_ID)
      expect(TokenPurchaseFromShieldedPoolTransitionWASM.fromStateTransition(roundTrip(purchase.toStateTransition())).totalAgreedPrice)
        .toEqual(BigInt(5000))
    })

    test('should reject a state transition of another type', function () {
      const transition = new ContractFeeClaimTransitionWASM(OWNER_ID, CONTRACT_ID, BigInt(1), 'owner')

      expect(() => ShieldFromIdentityTransitionWASM.fromStateTransition(transition.toStateTransition())).toThrow()
    })
  })

  describe('token pool transitions', function () {
    const base = (): TokenBaseTransitionWASM => new TokenBaseTransitionWASM(BigInt(1), 0, CONTRACT_ID, TOKEN_ID)
    const bundle = (): [SerializedActionWASM[], Uint8Array, Uint8Array, Uint8Array] =>
      [[createTestAction()], randomBytes(32), randomBytes(192), randomBytes(64)]

    test.each([
      ['Shield', () => new TokenShieldTransitionWASM(base(), BigInt(10), ...bundle()), TokenShieldTransitionWASM],
      ['Unshield', () => new TokenUnshieldTransitionWASM(base(), BigInt(10), OWNER_ID, ...bundle()), TokenUnshieldTransitionWASM],
      ['ShieldedTransfer', () => new TokenShieldedTransferTransitionWASM(base(), ...bundle()), TokenShieldedTransferTransitionWASM],
      ['MintToPool', () => new TokenMintToPoolTransitionWASM(base(), BigInt(10), ...bundle(), 'note'), TokenMintToPoolTransitionWASM],
      ['BurnFromPool', () => new TokenBurnFromPoolTransitionWASM(base(), BigInt(10), ...bundle()), TokenBurnFromPoolTransitionWASM],
      ['ClaimToPool', () => new TokenClaimToPoolTransitionWASM(base(), 'perpetual', undefined, ...bundle()), TokenClaimToPoolTransitionWASM],
      ['DirectPurchaseToPool', () => new TokenDirectPurchaseToPoolTransitionWASM(base(), BigInt(3), BigInt(300), ...bundle()), TokenDirectPurchaseToPoolTransitionWASM]
    ] as Array<[string, () => any, any]>)('%s', function (type, create, wasmClass) {
      const tokenTransition = new TokenTransitionWASM(create())

      expect(tokenTransition.getTransitionType()).toEqual(type)
      expect(tokenTransition.tokenId.base58()).toEqual(TOKEN_ID)
      expect(tokenTransition.getTransition()).toBeInstanceOf(wasmClass)
    })

    test('should expose transition fields', function () {
      const claim = new TokenClaimToPoolTransitionWASM(base(), 'perpetual', BigInt(99), ...bundle(), 'note')

      expect(claim.distributionType).toEqual('Perpetual')
      expect(claim.claimUpTo).toEqual(BigInt(99))
      expect(claim.publicNote).toEqual('note')

      claim.publicNote = undefined

      expect(claim.publicNote).toEqual(undefined)
    })
  })
})
