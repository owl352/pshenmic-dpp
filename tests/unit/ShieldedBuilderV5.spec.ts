import {
  BatchTransitionWASM,
  CommitmentTreeWASM,
  GroupStateTransitionInfoWASM,
  IdentifierWASM,
  IdentityPublicKeyWASM,
  IdentityTopUpFromShieldedPoolTransitionWASM,
  IdentityWASM,
  KeyType,
  NoteWASM,
  OrchardAddressWASM,
  PrivateKeyWASM,
  Purpose,
  SecurityLevel,
  ShieldFromIdentityTransitionWASM,
  ShieldedBuilderWASM,
  ShieldedMemoWASM,
  SpendableNoteWASM,
  StateTransitionWASM,
  TokenPurchaseFromShieldedPoolTransitionWASM,
  TokenShieldedPaymentWASM,
  TokenShieldedTransferWithShieldedFeeTransitionWASM,
  TokenTransitionWASM,
  TokenUnshieldWithShieldedFeeTransitionWASM
} from 'pshenmic-dpp'

const SEED = new Uint8Array(64)
for (let i = 0; i < 64; i++) SEED[i] = (i * 7 + 1) & 0xff
const COIN_TYPE = 1
const ACCOUNT = 0

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const TOKEN_ID = 'H7FRpZJqZK933r9CzZMsCuf1BM34NT5P2wSJyjDkprqy'
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

function key (id: number, purpose: Purpose, securityLevel: SecurityLevel): IdentityPublicKeyWASM {
  const data = Buffer.from(PRIVATE_KEY.getPublicKey().bytes()).toString('hex')
  return new IdentityPublicKeyWASM(id, purpose, securityLevel, KeyType.ECDSA_SECP256K1, false, data)
}

function tokenTransitionOf (stateTransition: StateTransitionWASM): TokenTransitionWASM {
  const batch = BatchTransitionWASM.fromStateTransition(StateTransitionWASM.fromBytes(stateTransition.bytes()))
  return batch.transitions[0].toTransition() as TokenTransitionWASM
}

describe('ShieldedBuilder v5', function () {
  const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
  const memo = ShieldedMemoWASM.empty()
  // token batch transitions must be signed with a critical key
  const authKey = key(1, Purpose.AUTHENTICATION, SecurityLevel.CRITICAL)
  let builder: ShieldedBuilderWASM

  beforeAll(async function () {
    builder = new ShieldedBuilderWASM()
    await builder.init()
  }, PROVING_TIMEOUT)

  test('shieldFromIdentity', async function () {
    const transferKey = key(2, Purpose.TRANSFER, SecurityLevel.CRITICAL)
    const identity = new IdentityWASM(OWNER_ID)
    identity.addPublicKey(transferKey)
    identity.balance = BigInt(1_000_000_000_000)

    const st = await builder.shieldFromIdentity(identity, address, BigInt(50_000_000), BigInt(1), transferKey, PRIVATE_KEY, 0, memo)
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

    // the pool pays the top-up plus the shielded fee
    expect(result.fee).toBeGreaterThan(BigInt(0))
    expect(transition.topUpAmount).toEqual(BigInt(1_000_000) + result.fee)
    expect(transition.anchor).toEqual(pool.anchor)
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
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), memo, undefined, authKey, PRIVATE_KEY, BigInt(1), 0
    )
    const mint = await builder.tokenMintToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), memo, undefined, 'minted',
      new GroupStateTransitionInfoWASM(0, OWNER_ID, true), authKey, PRIVATE_KEY, BigInt(2), 0
    )
    const claim = await builder.tokenClaimToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), 'perpetual', BigInt(1_700_000_000_000), memo, undefined, undefined, authKey, PRIVATE_KEY, BigInt(3), 0
    )
    const purchase = await builder.tokenDirectPurchaseToPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, address, BigInt(10), BigInt(1_000), memo, undefined, authKey, PRIVATE_KEY, BigInt(4), 0
    )

    expect(tokenTransitionOf(shield).getTransitionType()).toEqual('Shield')
    expect(tokenTransitionOf(mint).getTransitionType()).toEqual('MintToPool')
    expect(tokenTransitionOf(claim).getTransitionType()).toEqual('ClaimToPool')
    expect(tokenTransitionOf(purchase).getTransitionType()).toEqual('DirectPurchaseToPool')
    expect(tokenTransitionOf(purchase).identityContractNonce).toEqual(BigInt(4))
  }, PROVING_TIMEOUT * 2)

  test('tokenUnshield, tokenShieldedTransfer, tokenBurnFromPool', async function () {
    const pool = poolWithNote(BigInt(1_000), 0x44)
    const spend = [pool.spends, address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo] as const

    const unshield = await builder.tokenUnshield(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, pool.spends, OWNER_ID, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      authKey, PRIVATE_KEY, BigInt(1), 0
    )
    const transfer = await builder.tokenShieldedTransfer(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, spend[0], address, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      authKey, PRIVATE_KEY, BigInt(2), 0
    )
    const burn = await builder.tokenBurnFromPool(
      TOKEN_ID, OWNER_ID, CONTRACT_ID, 0, pool.spends, BigInt(10), address, SEED, COIN_TYPE, ACCOUNT, pool.anchor, memo,
      'burned', undefined, authKey, PRIVATE_KEY, BigInt(3), 0
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
