// Imports the shielded module and provides it to dpp
// explicitly via setShielded() (dpp itself is base-only on every entry).
import {
  AssetLockProofWASM,
  CommitmentTreeWASM,
  CoreScriptWASM,
  IdentityCreateFromShieldedPoolTransitionWASM,
  IdentityPublicKeyInCreationWASM,
  KeyType,
  NoteWASM,
  OrchardAddressWASM,
  OutPointWASM,
  PlatformAddressWASM,
  PoolingWASM,
  PrivateKeyWASM,
  Purpose,
  SecurityLevel,
  ShieldFromAssetLockTransitionWASM,
  ShieldedBuilderWASM,
  ShieldedMemoWASM,
  ShieldedOutputWASM,
  ShieldedTransferTransitionWASM,
  ShieldedWithdrawalTransitionWASM,
  SpendableNoteWASM,
  StateTransitionWASM,
  UnshieldTransitionWASM
} from '../utils/withShielded.js'

// Builder methods whose only other coverage is the wasm entry (WebAssembly.spec)
// or none at all. Runs against the native addon and pins the PUBLIC API contract
// the bytes-boundary marshalling (smart-A1) must preserve: same arguments, same
// result shapes, transitions that round-trip byte-exactly through bytes().

const SEED = new Uint8Array(64)
for (let i = 0; i < 64; i++) SEED[i] = (i * 7 + 1) & 0xff
const COIN_TYPE = 1
const ACCOUNT = 0

const PRIVATE_KEY = PrivateKeyWASM.fromWIF('cUy4wbim4y9NDwC24omx8oWY5WqfmjSU2gdcZtTXza2xDCAkQXRP')

const PROVING_TIMEOUT = 120000

interface Pool {
  spends: SpendableNoteWASM[]
  anchor: Uint8Array
}

/** A pool holding one note of `value` owned by the seed account, witnessed against its anchor **/
function poolWithNote (value: bigint, rseedByte: number): Pool {
  const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
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

/** Proofs are OsRng-randomized, so identity is asserted on the deterministic fields **/
function expectByteRoundTrip (st: StateTransitionWASM): void {
  expect(StateTransitionWASM.fromBytes(st.bytes()).bytes()).toEqual(st.bytes())
}

describe('ShieldedBuilder boundary', function () {
  // Fixtures are created AFTER setShielded() — never at collection time —
  // because the shielded classes (OrchardAddress, ...) only exist once it
  // resolves. beforeAll (not top-level await) keeps both jest modes working.
  let address: OrchardAddressWASM
  let memo: ShieldedMemoWASM
  let builder: ShieldedBuilderWASM

  beforeAll(async function () {
    address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
    memo = ShieldedMemoWASM.empty()
    builder = new ShieldedBuilderWASM()
    await builder.init()
  }, PROVING_TIMEOUT)

  test('shieldFromAssetLock', async function () {
    const outPoint = new OutPointWASM('79af4b339ddfee8c9b6d08d74155373c6ef547cda5e65473a254b9b0f8533f0c', 0)
    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1499737, outPoint)

    const st = await builder.shieldFromAssetLock(
      address, BigInt(40_000_000_000), assetLockProof, PRIVATE_KEY, memo, 0
    )

    expect(st).toBeInstanceOf(StateTransitionWASM)
    expectByteRoundTrip(st)

    const transition = ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
    expect(transition.valueBalance).toEqual(BigInt(40_000_000_000))
    expect(transition.assetLockProof.bytes()).toEqual(assetLockProof.bytes())
    expect(transition.actions.length).toBeGreaterThanOrEqual(1)
    expect(transition.anchor.length).toEqual(32)
    expect(transition.proof.length).toBeGreaterThan(0)
    expect(transition.bindingsSignature.length).toEqual(64)
    expect(transition.surplusOutput).toBeUndefined()
  }, PROVING_TIMEOUT)

  test('shieldFromAssetLock with surplusOutput', async function () {
    const outPoint = new OutPointWASM('79af4b339ddfee8c9b6d08d74155373c6ef547cda5e65473a254b9b0f8533f0c', 0)
    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(1499737, outPoint)
    const surplusOutput = createTestAddress()

    const st = await builder.shieldFromAssetLock(
      address, BigInt(40_000_000_000), assetLockProof, PRIVATE_KEY, memo, 0,
      undefined, surplusOutput
    )

    expectByteRoundTrip(st)
    const transition = ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
    expect(transition.surplusOutput?.bytes()).toEqual(surplusOutput.bytes())
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
    // the pool pays the withdrawal plus the shielded fee
    expect(transition.unshieldingAmount).toEqual(withdrawalAmount + result.fee)
    expect(transition.anchor).toEqual(pool.anchor)
    expect(transition.outputScript.bytes()).toEqual(outputScript.bytes())
    expect(transition.coreFeePerByte).toEqual(1)
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
    expect(transition.anchor).toEqual(pool.anchor)
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
    // pool -> pool: only the fee leaves the shielded pool
    expect(transition.valueBalance).toEqual(result.fee)
    expect(transition.anchor).toEqual(pool.anchor)
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
    // pool -> pool: only the fee leaves the shielded pool
    expect(transition.valueBalance).toEqual(result.fee)
    expect(transition.anchor).toEqual(pool.anchor)
    // two outputs + one change note
    expect(transition.actions.length).toEqual(3)
  }, PROVING_TIMEOUT)

  test('identityCreateFromShieldedPool', async function () {
    const pool = poolWithNote(BigInt(100_000_000_000), 0x55)
    // identity funding uses the fixed exit-denomination set
    const denomination = BigInt(3_000_000_000)
    const sendToAddress = createTestAddress()
    const publicKeyData = PRIVATE_KEY.getPublicKey().bytes()
    const publicKeys = [
      new IdentityPublicKeyInCreationWASM(
        0, Purpose.AUTHENTICATION, SecurityLevel.MASTER, KeyType.ECDSA_SECP256K1, false, publicKeyData
      )
    ]

    const result = await builder.identityCreateFromShieldedPool(
      publicKeys, [PRIVATE_KEY], denomination, sendToAddress, pool.spends,
      address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo
    )

    expect(result.predictedFee).toBeGreaterThan(BigInt(0))
    expect(result.publicKeys.length).toEqual(1)
    expect(result.publicKeys[0]).toBeInstanceOf(IdentityPublicKeyInCreationWASM)
    expect(result.publicKeys[0].data).toEqual(publicKeyData)
    expect(result.identityId.bytes().length).toEqual(32)
    expect(result.actions.length).toBeGreaterThanOrEqual(1)
    expect(result.anchor).toEqual(pool.anchor)
    expect(result.proof.length).toBeGreaterThan(0)
    expect(result.bindingsSignature.length).toEqual(64)

    // the result fields assemble into a valid identity-create transition
    const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
      result.publicKeys, denomination, result.actions, result.anchor, result.proof,
      result.bindingsSignature, sendToAddress, result.identityId
    )
    expect(transition.denomination).toEqual(denomination)
    expect(transition.identityId.bytes()).toEqual(result.identityId.bytes())
    expectByteRoundTrip(transition.toStateTransition())
  }, PROVING_TIMEOUT)
})
