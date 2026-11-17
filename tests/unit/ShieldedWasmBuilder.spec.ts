import { loadShielded } from 'pshenmic-orchard'
import {
  AddressFundsFeeStrategyStepWASM,
  AssetLockProofWASM,
  BatchTransitionWASM,
  CommitmentTreeWASM,
  CoreScriptWASM,
  GroupStateTransitionInfoWASM,
  IdentifierWASM,
  IdentityCreateFromShieldedPoolTransitionWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityPublicKeyWASM,
  IdentityTopUpFromShieldedPoolTransitionWASM,
  IdentityWASM,
  InputAddressWASM,
  KeyType,
  NoteWASM,
  ShieldedAddressWASM,
  OutPointWASM,
  PlatformAddressWASM,
  PoolingWASM,
  PrivateKeyWASM,
  Purpose,
  SecurityLevel,
  ShieldFromAssetLockTransitionWASM,
  ShieldFromIdentityTransitionWASM,
  ShieldTransitionWASM,
  ShieldedBuilderWASM,
  ShieldedMemoWASM,
  ShieldedOutputWASM,
  ShieldedTransferTransitionWASM,
  ShieldedWithdrawalTransitionWASM,
  SpendableNoteWASM,
  StateTransitionWASM,
  TokenPurchaseFromShieldedPoolTransitionWASM,
  TokenShieldedPaymentWASM,
  TokenShieldedTransferWithShieldedFeeTransitionWASM,
  TokenTransitionWASM,
  TokenUnshieldWithShieldedFeeTransitionWASM,
  UnshieldTransitionWASM,
  setShielded,
  shieldedOvkFromSeed
} from 'pshenmic-dpp/wasm'

// Every builder method that crosses the base <-> shielded instance boundary,
// exercised through the WASM entry (pshenmic-dpp/wasm) after setShielded().
// The native suites (ShieldedBuilderV5 / ShieldedBuilderBoundary / Shielded)
// resolve to the single-instance addon and are structurally blind to
// cross-instance wrapped-object leaks; this suite runs against the actual
// split, so any base-kept class passed as a wrapped napi object (instead of
// bytes) into the shielded instance fails here. Fixtures are created AFTER
// setShielded() — never at collection time — because the shielded classes
// (OrchardAddress, Note, CommitmentTree, ...) only exist once it resolves.

const SEED = new Uint8Array(64)
for (let i = 0; i < 64; i++) SEED[i] = (i * 7 + 1) & 0xff
const COIN_TYPE = 1
const ACCOUNT = 0

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const TOKEN_ID = 'H7FRpZJqZK933r9CzZMsCuf1BM34NT5P2wSJyjDkprqy'
const WIF = 'cUy4wbim4y9NDwC24omx8oWY5WqfmjSU2gdcZtTXza2xDCAkQXRP'
const DASH = 100_000_000_000n

const PROVING_TIMEOUT = 120000

function hexToBytes (hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  return bytes
}

interface Pool {
  spends: SpendableNoteWASM[]
  anchor: Uint8Array
}

function poolWithNote (value: bigint, rseedByte: number): Pool {
  const address = ShieldedAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
  const rho = new Uint8Array(32)
  rho[0] = 1
  const note = new NoteWASM(address, value, rho, new Uint8Array(32).fill(rseedByte))

  const tree = new CommitmentTreeWASM()
  tree.append(note.cmx, true)
  tree.checkpoint(1)

  return { spends: [new SpendableNoteWASM(note, tree.witness(0)!)], anchor: tree.anchor() }
}

function createTestAddress (): PlatformAddressWASM {
  const addressBytes = new Uint8Array(21)
  addressBytes[0] = 0x00 // P2PKH
  addressBytes.set(new Uint8Array(20).fill(0x07), 1)
  return PlatformAddressWASM.fromBytes(addressBytes)
}

function platformAddressFromPrivateKey (pk: PrivateKeyWASM): PlatformAddressWASM {
  const hash = hexToBytes(pk.getPublicKeyHash())
  const bytes = new Uint8Array(21)
  bytes[0] = 0x00
  bytes.set(hash, 1)
  return PlatformAddressWASM.fromBytes(bytes)
}

/** Proofs are OsRng-randomized, so identity is asserted on the deterministic fields **/
function expectByteRoundTrip (st: StateTransitionWASM): void {
  expect(StateTransitionWASM.fromBytes(st.bytes()).bytes()).toEqual(st.bytes())
}

describe('ShieldedBuilder cross-boundary (wasm entry)', function () {
  let builder: ShieldedBuilderWASM
  let address: ShieldedAddressWASM
  let memo: ShieldedMemoWASM
  let privateKey: PrivateKeyWASM
  let authKey: IdentityPublicKeyWASM

  function key (id: number, purpose: Purpose, securityLevel: SecurityLevel): IdentityPublicKeyWASM {
    const data = Buffer.from(privateKey.getPublicKey().bytes()).toString('hex')
    return new IdentityPublicKeyWASM(id, purpose, securityLevel, KeyType.ECDSA_SECP256K1, false, data)
  }

  function tokenTransitionOf (stateTransition: StateTransitionWASM): TokenTransitionWASM {
    const batch = BatchTransitionWASM.fromStateTransition(StateTransitionWASM.fromBytes(stateTransition.bytes()))
    return batch.transitions[0].toTransition() as TokenTransitionWASM
  }

  beforeAll(async function () {
    setShielded(loadShielded())
    builder = new ShieldedBuilderWASM()
    await builder.init()
    address = ShieldedAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
    memo = ShieldedMemoWASM.empty()
    privateKey = PrivateKeyWASM.fromWIF(WIF)
    authKey = key(1, Purpose.AUTHENTICATION, SecurityLevel.CRITICAL)
  }, PROVING_TIMEOUT)

  test('shieldFromAssetLock', async function () {
    const outPoint = new OutPointWASM('79af4b339ddfee8c9b6d08d74155373c6ef547cda5e65473a254b9b0f8533f0c', 0)
    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1499737, outPoint)

    const st = await builder.shieldFromAssetLock(address, BigInt(40_000_000_000), assetLockProof, privateKey, memo, 0)

    expect(st).toBeInstanceOf(StateTransitionWASM)
    expectByteRoundTrip(st)
    const transition = ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
    expect(transition.valueBalance).toEqual(BigInt(40_000_000_000))
    expect(transition.assetLockProof.bytes()).toEqual(assetLockProof.bytes())
    expect(transition.actions.length).toBeGreaterThanOrEqual(1)
    expect(transition.bindingsSignature.length).toEqual(64)
  }, PROVING_TIMEOUT)

  test('shieldFromAssetLock with surplusOutput', async function () {
    const outPoint = new OutPointWASM('79af4b339ddfee8c9b6d08d74155373c6ef547cda5e65473a254b9b0f8533f0c', 0)
    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1499737, outPoint)
    const surplusOutput = createTestAddress()

    const st = await builder.shieldFromAssetLock(
      address, BigInt(40_000_000_000), assetLockProof, privateKey, memo, 0, undefined, surplusOutput
    )

    expectByteRoundTrip(st)
    const transition = ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
    expect(transition.surplusOutput?.bytes()).toEqual(surplusOutput.bytes())
  }, PROVING_TIMEOUT)

  test('shield (transparent -> pool)', async function () {
    const senderOvk = shieldedOvkFromSeed(SEED, COIN_TYPE, ACCOUNT)
    const inputAddress = platformAddressFromPrivateKey(privateKey)
    const input = new InputAddressWASM(inputAddress, 0, DASH / 2n)

    const st = await builder.shield(
      address, (DASH * 4n) / 10n, [input], [privateKey],
      [AddressFundsFeeStrategyStepWASM.DeductFromInput(0)], 0, memo, senderOvk
    )

    expectByteRoundTrip(st)
    const transition = ShieldTransitionWASM.fromStateTransition(st)
    expect(transition.amount).toEqual((DASH * 4n) / 10n)
    expect(transition.actions.length).toBeGreaterThanOrEqual(1)
    expect(transition.proof.length).toBeGreaterThan(0)
  }, PROVING_TIMEOUT)

  test('shieldedWithdrawal', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x51)
    const outputScript = CoreScriptWASM.newP2PKH(new Uint8Array(20).fill(0x31))
    const withdrawalAmount = BigInt(1_000_000)

    const result = await builder.shieldedWithdrawal(
      pool.spends, withdrawalAmount, outputScript, 1, PoolingWASM.Standard,
      address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(result.fee).toBeGreaterThan(BigInt(0))
    expectByteRoundTrip(result.stateTransition)
    const transition = ShieldedWithdrawalTransitionWASM.fromStateTransition(result.stateTransition)
    expect(transition.unshieldingAmount).toEqual(withdrawalAmount + result.fee)
    expect(transition.outputScript.bytes()).toEqual(outputScript.bytes())
    expect(transition.pooling).toEqual('Standard')
  }, PROVING_TIMEOUT)

  test('unshield', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x52)
    const outputAddress = createTestAddress()
    const unshieldAmount = BigInt(1_000_000)

    const result = await builder.unshield(
      pool.spends, outputAddress, unshieldAmount, address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(result.fee).toBeGreaterThan(BigInt(0))
    expectByteRoundTrip(result.stateTransition)
    const transition = UnshieldTransitionWASM.fromStateTransition(result.stateTransition)
    expect(transition.unshieldingAmount).toEqual(unshieldAmount + result.fee)
    expect(transition.outputAddress.bytes()).toEqual(outputAddress.bytes())
  }, PROVING_TIMEOUT)

  test('shieldedTransfer', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x53)
    const transferAmount = BigInt(1_000_000)

    const result = await builder.shieldedTransfer(
      pool.spends, address, transferAmount, address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(result.fee).toBeGreaterThan(BigInt(0))
    expectByteRoundTrip(result.stateTransition)
    const transition = ShieldedTransferTransitionWASM.fromStateTransition(result.stateTransition)
    expect(transition.valueBalance).toEqual(result.fee)
  }, PROVING_TIMEOUT)

  test('shieldedTransferMulti', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x54)
    const outputs = [
      new ShieldedOutputWASM(address, BigInt(1_000_000), ShieldedMemoWASM.fromString('first')),
      new ShieldedOutputWASM(address, BigInt(2_000_000), ShieldedMemoWASM.fromString('second'))
    ]

    const result = await builder.shieldedTransferMulti(
      pool.spends, outputs, address, SEED, COIN_TYPE, ACCOUNT, pool.anchor
    )

    expect(result.fee).toBeGreaterThan(BigInt(0))
    expectByteRoundTrip(result.stateTransition)
    const transition = ShieldedTransferTransitionWASM.fromStateTransition(result.stateTransition)
    expect(transition.valueBalance).toEqual(result.fee)
    expect(transition.actions.length).toEqual(3)
  }, PROVING_TIMEOUT)

  test('identityCreateFromShieldedPool', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x55)
    const denomination = BigInt(3_000_000_000)
    const sendToAddress = createTestAddress()
    const publicKeyData = privateKey.getPublicKey().bytes()
    const publicKeys = [
      new IdentityPublicKeyInCreationWASM(0, Purpose.AUTHENTICATION, SecurityLevel.MASTER, KeyType.ECDSA_SECP256K1, false, publicKeyData)
    ]

    const result = await builder.identityCreateFromShieldedPool(
      publicKeys, [privateKey], denomination, sendToAddress, pool.spends,
      address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(result.predictedFee).toBeGreaterThan(BigInt(0))
    expect(result.publicKeys[0]).toBeInstanceOf(IdentityPublicKeyInCreationWASM)
    expect(result.publicKeys[0].data).toEqual(publicKeyData)
    expect(result.identityId.bytes().length).toEqual(32)
    expect(result.bindingsSignature.length).toEqual(64)

    const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
      result.publicKeys, denomination, result.actions, result.anchor, result.proof,
      result.bindingsSignature, sendToAddress, result.identityId
    )
    expect(transition.denomination).toEqual(denomination)
    expectByteRoundTrip(transition.toStateTransition())
  }, PROVING_TIMEOUT)

  test('shieldFromIdentity', async function () {
    const transferKey = key(2, Purpose.TRANSFER, SecurityLevel.CRITICAL)
    const identity = new IdentityWASM(OWNER_ID)
    identity.addPublicKey(transferKey)
    identity.balance = BigInt(1_000_000_000_000)

    const st = await builder.shieldFromIdentity(identity, address, BigInt(50_000_000), BigInt(1), transferKey, privateKey, 0, memo)
    const transition = ShieldFromIdentityTransitionWASM.fromStateTransition(StateTransitionWASM.fromBytes(st.bytes()))

    expect(transition.amount).toEqual(BigInt(50_000_000))
    expect(transition.identityId.base58()).toEqual(OWNER_ID)
    expect(transition.signature.length).toBeGreaterThan(0)
  }, PROVING_TIMEOUT)

  test('identityTopUpFromShieldedPool', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x42)

    const result = await builder.identityTopUpFromShieldedPool(
      pool.spends, OWNER_ID, BigInt(1_000_000), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )
    const transition = IdentityTopUpFromShieldedPoolTransitionWASM.fromStateTransition(result.stateTransition)

    expect(result.fee).toBeGreaterThan(BigInt(0))
    expect(transition.topUpAmount).toEqual(BigInt(1_000_000) + result.fee)
  }, PROVING_TIMEOUT)

  test('documentTokenPayment', async function () {
    const pool = poolWithNote(BigInt(1_000), 0x43)

    const payment = await builder.documentTokenPayment(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, OWNER_ID, pool.spends, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(payment).toBeInstanceOf(TokenShieldedPaymentWASM)
    expect(payment.amount).toEqual(BigInt(10))
    expect(payment.anchor).toEqual(pool.anchor)
  }, PROVING_TIMEOUT)

  test('tokenShield, tokenMintToPool, tokenClaimToPool, tokenDirectPurchaseToPool', async function () {
    const shield = await builder.tokenShield(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), memo, undefined, authKey, privateKey, BigInt(1), 0
    )
    const mint = await builder.tokenMintToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), memo, undefined, 'minted',
      new GroupStateTransitionInfoWASM(0, OWNER_ID, true), authKey, privateKey, BigInt(2), 0
    )
    const claim = await builder.tokenClaimToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), 'perpetual', BigInt(1_700_000_000_000), memo, undefined, undefined, authKey, privateKey, BigInt(3), 0
    )
    const purchase = await builder.tokenDirectPurchaseToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), BigInt(1_000), memo, undefined, authKey, privateKey, BigInt(4), 0
    )

    expect(tokenTransitionOf(shield).getTransitionType()).toEqual('Shield')
    expect(tokenTransitionOf(mint).getTransitionType()).toEqual('MintToPool')
    expect(tokenTransitionOf(claim).getTransitionType()).toEqual('ClaimToPool')
    expect(tokenTransitionOf(purchase).getTransitionType()).toEqual('DirectPurchaseToPool')
    expect(tokenTransitionOf(purchase).identityContractNonce).toEqual(BigInt(4))
  }, PROVING_TIMEOUT * 2)

  test('tokenUnshield, tokenShieldedTransfer, tokenBurnFromPool', async function () {
    const pool = poolWithNote(BigInt(1_000), 0x44)

    const unshield = await builder.tokenUnshield(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, pool.spends, OWNER_ID, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      authKey, privateKey, BigInt(1), 0
    )
    const transfer = await builder.tokenShieldedTransfer(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, pool.spends, address, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      authKey, privateKey, BigInt(2), 0
    )
    const burn = await builder.tokenBurnFromPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, pool.spends, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      'burned', undefined, authKey, privateKey, BigInt(3), 0
    )

    expect(tokenTransitionOf(unshield).getTransitionType()).toEqual('Unshield')
    expect(tokenTransitionOf(transfer).getTransitionType()).toEqual('ShieldedTransfer')
    expect(tokenTransitionOf(burn).getTransitionType()).toEqual('BurnFromPool')
  }, PROVING_TIMEOUT * 2)

  test('token transitions paid from the shielded pool', async function () {
    const tokenPool = poolWithNote(BigInt(1_000), 0x45)
    const feePool = poolWithNote(BigInt(100_000_000_000), 0x46)

    const transfer = await builder.tokenShieldedTransferWithShieldedFee(
      TOKEN_ID, CONTRACT_ID, 0, tokenPool.spends, address, tokenPool.anchor, address, BigInt(10),
      feePool.spends, address, feePool.anchor, SEED, COIN_TYPE, ACCOUNT, memo
    )
    const unshield = await builder.tokenUnshieldWithShieldedFee(
      TOKEN_ID, CONTRACT_ID, 0, tokenPool.spends, address, tokenPool.anchor, OWNER_ID, BigInt(10),
      feePool.spends, address, feePool.anchor, SEED, COIN_TYPE, ACCOUNT, memo
    )
    const purchase = await builder.tokenPurchaseFromShieldedPool(
      TOKEN_ID, CONTRACT_ID, 0, address, BigInt(5), BigInt(5_000),
      feePool.spends, address, feePool.anchor, SEED, COIN_TYPE, ACCOUNT, memo
    )

    const transferTransition = TokenShieldedTransferWithShieldedFeeTransitionWASM.fromStateTransition(transfer.stateTransition)
    expect(transferTransition.tokenAnchor).toEqual(tokenPool.anchor)
    expect(transferTransition.feeAnchor).toEqual(feePool.anchor)
    expect(transfer.fee).toBeGreaterThan(BigInt(0))
    expect(TokenUnshieldWithShieldedFeeTransitionWASM.fromStateTransition(unshield.stateTransition).recipientId.base58()).toEqual(OWNER_ID)
    expect(TokenPurchaseFromShieldedPoolTransitionWASM.fromStateTransition(purchase.stateTransition).tokenCount).toEqual(BigInt(5))
    expect(new IdentifierWASM(TOKEN_ID).base58()).toEqual(TOKEN_ID)
  }, PROVING_TIMEOUT * 2)
})
