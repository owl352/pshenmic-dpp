import {
  IdentifierWASM,
  PrivateDocumentCreateFromShieldedPoolTransitionWASM,
  ShieldedMemoWASM,
  ShieldedTransferTransitionWASM,
  ShieldedWithdrawalTransitionWASM,
  ShieldFromAssetLockTransitionWASM,
  ShieldFromIdentityTransitionWASM,
  ShieldTransitionWASM,
  IdentityCreateFromShieldedPoolTransitionWASM,
  IdentityTopUpFromShieldedPoolTransitionWASM,
  TokenPurchaseFromShieldedPoolTransitionWASM,
  TokenShieldedTransferWithShieldedFeeTransitionWASM,
  TokenUnshieldWithShieldedFeeTransitionWASM,
  UnshieldTransitionWASM,
  verifyMostRecentShieldedAnchorProof,
  verifyShieldedAnchorsProof,
  verifyShieldedEncryptedNotesProof,
  verifyShieldedNotesCountProof,
  verifyShieldedNullifiersProof,
  verifyShieldedPoolStateProof
} from 'pshenmic-dpp'

const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const ANCHOR = new Uint8Array(32)
const EMPTY = new Uint8Array()
const BINDING_SIGNATURE = new Uint8Array(64)

describe('shielded data API is back in pshenmic-dpp', function () {
  test('exports the dependency-free shielded memo and transitions', function () {
    expect(ShieldedMemoWASM).toBeDefined()
    expect(ShieldTransitionWASM).toBeDefined()
    expect(ShieldFromAssetLockTransitionWASM).toBeDefined()
    expect(ShieldFromIdentityTransitionWASM).toBeDefined()
    expect(ShieldedTransferTransitionWASM).toBeDefined()
    expect(ShieldedWithdrawalTransitionWASM).toBeDefined()
    expect(UnshieldTransitionWASM).toBeDefined()
    expect(IdentityCreateFromShieldedPoolTransitionWASM).toBeDefined()
    expect(IdentityTopUpFromShieldedPoolTransitionWASM).toBeDefined()
    expect(TokenPurchaseFromShieldedPoolTransitionWASM).toBeDefined()
    expect(TokenShieldedTransferWithShieldedFeeTransitionWASM).toBeDefined()
    expect(TokenUnshieldWithShieldedFeeTransitionWASM).toBeDefined()
    expect(PrivateDocumentCreateFromShieldedPoolTransitionWASM).toBeDefined()
  })

  test('exports the shielded proof verifiers', function () {
    expect(verifyShieldedEncryptedNotesProof).toBeDefined()
    expect(verifyShieldedAnchorsProof).toBeDefined()
    expect(verifyMostRecentShieldedAnchorProof).toBeDefined()
    expect(verifyShieldedPoolStateProof).toBeDefined()
    expect(verifyShieldedNotesCountProof).toBeDefined()
    expect(verifyShieldedNullifiersProof).toBeDefined()
  })

  test('builds a payment-reference memo', function () {
    const memo = ShieldedMemoWASM.fromPaymentRef(new Uint8Array([1, 2, 3, 4]))

    expect(memo.toBytes()).toHaveLength(36)
    expect(memo.paymentRef?.slice(0, 4)).toEqual(new Uint8Array([1, 2, 3, 4]))
    expect(new Uint8Array(memo.toBytes()).slice(4, 8)).toEqual(new Uint8Array([1, 2, 3, 4]))
  })

  test('builds a shielded transfer transition', function () {
    const transition = new ShieldedTransferTransitionWASM(
      [],
      BigInt(0),
      ANCHOR,
      EMPTY,
      BINDING_SIGNATURE
    )

    expect(transition.toStateTransition().getActionTypeNumber()).toEqual(16)
  })

  test('builds a private document transition (type 29)', function () {
    const transition = new PrivateDocumentCreateFromShieldedPoolTransitionWASM(
      new IdentifierWASM(CONTRACT_ID),
      'note',
      [new Uint8Array(64)],
      [],
      BigInt(0),
      ANCHOR,
      EMPTY,
      BINDING_SIGNATURE
    )

    expect(transition.dataContractId.base58()).toEqual(CONTRACT_ID)
    expect(transition.documentTypeName).toEqual('note')
    expect(transition.entries).toHaveLength(1)
    expect(transition.toStateTransition().getActionTypeNumber()).toEqual(29)
  })
})
