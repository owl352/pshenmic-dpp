import shielded from 'dash-platform-shielded'
import {
  CommitmentTreeWASM,
  NoteWASM,
  OrchardAddressWASM,
  RecoveredNoteWASM,
  SerializedActionWASM,
  ShieldedBuilderWASM,
  ShieldedMemoWASM,
  ShieldedOutputWASM,
  ShieldedTransferTransitionWASM,
  SpendableNoteWASM,
  setShielded,
  recoverNotes
} from 'pshenmic-dpp/wasm'

// Cross-instance boundary regression for the WASM entry (base + shielded split).
// ShieldedMemoNAPI and SerializedActionNAPI are base-kept classes: their wrapped
// napi objects live in the BASE instance's per-Env wrap map and CANNOT be passed
// into the SHIELDED instance (and vice versa). Everything crossing the boundary
// must be BYTES. The native suites (ShieldedBuilderBoundary etc.) resolve to the
// single-instance addon and are blind to this — these tests run through
// pshenmic-dpp/wasm after setShielded(), i.e. against the actual split.

const SEED = new Uint8Array(64)
for (let i = 0; i < 64; i++) SEED[i] = (i * 7 + 1) & 0xff
const COIN_TYPE = 1
const ACCOUNT = 0

const PROVING_TIMEOUT = 120000

/** A pool holding one note of `value` owned by the seed account, witnessed against its anchor **/
function poolWithNote (value: bigint, rseedByte: number): { spends: SpendableNoteWASM[], anchor: Uint8Array } {
  const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
  const rho = new Uint8Array(32)
  rho[0] = 1
  const note = new NoteWASM(address, value, rho, new Uint8Array(32).fill(rseedByte))

  const tree = new CommitmentTreeWASM()
  tree.append(note.cmx, true)
  tree.checkpoint(1)

  return { spends: [new SpendableNoteWASM(note, tree.witness(0)!)], anchor: tree.anchor() }
}

describe('shielded wasm boundary (base <-> shielded instances)', function () {
  let builder: ShieldedBuilderWASM

  beforeAll(async function () {
    setShielded(shielded)
    builder = new ShieldedBuilderWASM()
    await builder.init()
  }, PROVING_TIMEOUT)

  describe('ShieldedOutputWASM (memo crosses as bytes)', function () {
    test('constructor accepts a base-instance memo and getters round-trip', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const memo = ShieldedMemoWASM.fromString('wasm boundary')

      // Before the fix this threw: "Failed to recover `ShieldedMemoNAPI` type
      // from napi value" — the base memo raw leaked into the shielded instance.
      const output = new ShieldedOutputWASM(address, BigInt(1_000_000), memo)

      expect(output.address.bytes()).toEqual(address.bytes())
      expect(output.amount).toEqual(BigInt(1_000_000))
      expect(output.memo).toBeInstanceOf(ShieldedMemoWASM)
      expect(output.memo.toString()).toEqual('wasm boundary')
      expect(output.memo.toBytes()).toEqual(memo.toBytes())
    })

    test('memo getter result is base-typed and re-crosses the boundary', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const output = new ShieldedOutputWASM(address, BigInt(5), ShieldedMemoWASM.empty())

      // The getter must re-wrap via fromBytes (base instance), not hand out a
      // shielded-instance raw: feeding it back into a new output proves it.
      const memo = output.memo
      const copy = new ShieldedOutputWASM(address, BigInt(5), memo)
      expect(copy.memo.toBytes()).toEqual(memo.toBytes())
    })

    test('setters cross as bytes too', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const output = new ShieldedOutputWASM(address, BigInt(1), ShieldedMemoWASM.empty())

      const newMemo = ShieldedMemoWASM.fromString('replaced')
      output.memo = newMemo
      expect(output.memo.toString()).toEqual('replaced')
      expect(output.memo.toBytes()).toEqual(newMemo.toBytes())

      const newAddress = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT, 1)
      output.address = newAddress
      expect(output.address.bytes()).toEqual(newAddress.bytes())

      output.amount = BigInt(42)
      expect(output.amount).toEqual(BigInt(42))
    })
  })

  describe('recoverNotes (actions cross as bytes)', function () {
    test('foreign actions decrypt to nothing instead of throwing', function () {
      // A base-instance SerializedActionWASM: before the fix its raw leaked
      // into the shielded instance ("Failed to recover `SerializedActionNAPI`").
      const action = new SerializedActionWASM(
        new Uint8Array(32).fill(1),
        new Uint8Array(32).fill(2),
        new Uint8Array(32).fill(3),
        new Uint8Array(580).fill(4),
        new Uint8Array(32).fill(5),
        new Uint8Array(64).fill(6)
      )

      expect(recoverNotes([action], SEED, COIN_TYPE, ACCOUNT)).toEqual([])
    })
  })

  describe('shieldedTransferMulti end-to-end on the wasm split', function () {
    test('proves a multi-output transfer and recovers its notes', async function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const pool = poolWithNote(BigInt(100_000_000_000), 0x61)
      const outputs = [
        new ShieldedOutputWASM(address, BigInt(1_000_000), ShieldedMemoWASM.fromString('first')),
        new ShieldedOutputWASM(address, BigInt(2_000_000), ShieldedMemoWASM.fromString('second'))
      ]

      const result = await builder.shieldedTransferMulti(
        pool.spends, outputs, address, SEED, COIN_TYPE, ACCOUNT, pool.anchor
      )

      expect(result.fee).toBeGreaterThan(BigInt(0))

      const transition = ShieldedTransferTransitionWASM.fromStateTransition(result.stateTransition)
      // pool -> pool: only the fee leaves the shielded pool
      expect(transition.valueBalance).toEqual(result.fee)
      expect(transition.anchor).toEqual(pool.anchor)
      // two outputs + one change note
      expect(transition.actions.length).toEqual(3)

      // The proven actions are base-kept SerializedActionWASM values; feeding
      // them back through recoverNotes exercises the bytes boundary again and
      // proves the outputs really carry the requested values.
      const recovered = recoverNotes(transition.actions, SEED, COIN_TYPE, ACCOUNT)
      expect(recovered.length).toEqual(3)

      const values = recovered.map(r => r.note.value).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      expect(values).toContain(BigInt(1_000_000))
      expect(values).toContain(BigInt(2_000_000))
      // the third note is the change: pool value minus outputs minus fee
      expect(values[2]).toEqual(BigInt(100_000_000_000) - BigInt(3_000_000) - result.fee)

      for (const entry of recovered) {
        expect(entry).toBeInstanceOf(RecoveredNoteWASM)
        expect(entry.note).toBeInstanceOf(NoteWASM)
        expect(entry.nullifier.length).toEqual(32)
        expect(entry.index).toBeGreaterThanOrEqual(0)
        expect(entry.index).toBeLessThan(transition.actions.length)
      }
      // one note per action, indices unique
      expect(new Set(recovered.map(r => r.index)).size).toEqual(3)
    }, PROVING_TIMEOUT * 2)
  })
})
