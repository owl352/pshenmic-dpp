import {
  ShieldedMemoWASM,
  OrchardAddressWASM,
  FullViewingKeyWASM,
  IncomingViewingKeyWASM,
  orchardOvkFromSeed,
  NoteWASM,
  MerklePathWASM,
  SpendableNoteWASM,
  CommitmentTreeWASM,
  ShieldedBuilderWASM,
  OrchardProverWASM,
  InputAddressWASM,
  AddressFundsFeeStrategyStepWASM,
  PrivateKeyWASM,
  PlatformAddressWASM,
  ShieldTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'

// Deterministic 64-byte BIP-39-style seed. Orchard derives via ZIP-32
// (m/32'/coinType'/account'), so any 64 bytes is a valid seed for derivation.
const SEED = new Uint8Array(64)
for (let i = 0; i < 64; i++) SEED[i] = (i * 7 + 1) & 0xff

const COIN_TYPE = 1 // testnets
const ACCOUNT = 0

// A funded testnet WIF reused across the builder/deposit tests.
const WIF = 'cUy4wbim4y9NDwC24omx8oWY5WqfmjSU2gdcZtTXza2xDCAkQXRP'

// The memo payload field is a fixed 32 bytes (MEMO_PAYLOAD_SIZE) on the wire.
// Text memos may be shorter and are zero-padded to it; `other` payloads are
// taken verbatim and so must match it exactly.
const MEMO_PAYLOAD_SIZE = 32

const DASH = 100_000_000_000n

function hexToBytes (hex: string): Uint8Array {
  return Uint8Array.from(hex.match(/../g)!.map((x) => parseInt(x, 16)))
}

// A canonical Orchard note: rho is a valid Pallas base-field element (value 1),
// rseed is non-degenerate. Produces a valid commitment (cmx) the tree accepts.
function createTestNote (value: bigint = 1000n): NoteWASM {
  const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
  const rho = new Uint8Array(32)
  rho[0] = 1
  const rseed = new Uint8Array(32).fill(0x42)
  return new NoteWASM(address, value, rho, rseed)
}

// Platform P2PKH address (21 bytes: 0x00 type + 20-byte pubkey hash) for a key.
function platformAddressFromPrivateKey (pk: PrivateKeyWASM): PlatformAddressWASM {
  const hash = hexToBytes(pk.getPublicKeyHash())
  const bytes = new Uint8Array(21)
  bytes[0] = 0x00
  bytes.set(hash, 1)
  return PlatformAddressWASM.fromBytes(bytes)
}

describe('ShieldedMemo', function () {
  describe('empty', function () {
    test('should create an empty memo', function () {
      const memo = ShieldedMemoWASM.empty()

      expect(memo).toBeInstanceOf(ShieldedMemoWASM)
      expect(memo.toBytes().length).toEqual(36) // on-wire memo size
      expect(memo.toString()).toEqual('')
    })
  })

  describe('fromString', function () {
    test('should create a text memo from a 32-char string', function () {
      const text = 'A'.repeat(MEMO_PAYLOAD_SIZE)
      const memo = ShieldedMemoWASM.fromString(text)

      expect(memo).toBeInstanceOf(ShieldedMemoWASM)
      expect(memo.toBytes().length).toEqual(36)
      expect(memo.toString()).toEqual(text)
    })

    test('should accept text shorter than the payload', function () {
      const text = 'thanks for lunch' // 16 bytes, half the payload
      const memo = ShieldedMemoWASM.fromString(text)
      const bytes = memo.toBytes()

      // The wire memo stays a fixed 36 bytes: a 4-byte little-endian kind tag
      // (1 = text), the utf-8 text, then zero padding out to the 32-byte
      // payload. The padding is not part of the decoded text.
      expect(bytes.length).toEqual(36)
      expect(Array.from(bytes.slice(0, 4))).toEqual([1, 0, 0, 0])
      expect(new TextDecoder().decode(bytes.slice(4, 4 + text.length))).toEqual(text)
      expect(bytes.slice(4 + text.length).every((byte) => byte === 0)).toBe(true)
      expect(memo.toString()).toEqual(text)
    })

    test('should accept an empty string', function () {
      const memo = ShieldedMemoWASM.fromString('')

      expect(memo.toBytes().length).toEqual(36)
      expect(memo.toString()).toEqual('')
    })

    test('should count multi-byte characters by their utf-8 byte length', function () {
      // 8 x U+1F355 = 32 bytes, exactly the payload; 9 would be 36 bytes.
      const memo = ShieldedMemoWASM.fromString('🍕'.repeat(8))

      expect(memo.toString()).toEqual('🍕'.repeat(8))
      expect(() => ShieldedMemoWASM.fromString('🍕'.repeat(9))).toThrow()
    })

    test('should reject text longer than 32 bytes', function () {
      expect(() => ShieldedMemoWASM.fromString('A'.repeat(MEMO_PAYLOAD_SIZE + 1))).toThrow()
    })
  })

  describe('other', function () {
    test('should create a typed memo from a 32-byte payload', function () {
      const payload = new Uint8Array(MEMO_PAYLOAD_SIZE).fill(9)
      const memo = ShieldedMemoWASM.other(7, payload)

      expect(memo).toBeInstanceOf(ShieldedMemoWASM)
      expect(memo.toBytes().length).toEqual(36)
    })

    test('should reject a payload that is not 32 bytes', function () {
      expect(() => ShieldedMemoWASM.other(7, new Uint8Array([1, 2, 3]))).toThrow()
    })
  })
})

describe('OrchardAddress', function () {
  describe('fromSeed', function () {
    test('should derive an address from a seed', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(address).toBeInstanceOf(OrchardAddressWASM)
      expect(address.bytes().length).toEqual(43)
    })

    test('should be deterministic for the same seed', function () {
      const a = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const b = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(a.bytes()).toEqual(b.bytes())
    })
  })

  describe('serialization', function () {
    test('should roundtrip through bytes', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const restored = OrchardAddressWASM.fromBytes(address.bytes())

      expect(restored.bytes()).toEqual(address.bytes())
    })

    test('should roundtrip through bech32m', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const bech32m = address.toBech32m('testnet')
      const restored = OrchardAddressWASM.fromBech32m(bech32m)

      expect(restored.bytes()).toEqual(address.bytes())
    })
  })

  describe('orchardOvkFromSeed', function () {
    test('should derive a 32-byte outgoing viewing key', function () {
      const ovk = orchardOvkFromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(ovk.length).toEqual(32)
    })
  })

  describe('fromFullViewingKey', function () {
    test('should match the address derived from the same seed', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromFullViewingKey(fvk).bytes())
        .toEqual(OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
    })

    test('should derive a different address per diversifier index', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromFullViewingKey(fvk, 1).bytes())
        .not.toEqual(OrchardAddressWASM.fromFullViewingKey(fvk, 0).bytes())
    })

    test('should derive a different address per scope', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromFullViewingKey(fvk, 0, 'internal').bytes())
        .not.toEqual(OrchardAddressWASM.fromFullViewingKey(fvk, 0, 'external').bytes())
    })

    test('should reject an unknown scope', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(() => OrchardAddressWASM.fromFullViewingKey(fvk, 0, 'nope' as any)).toThrow()
    })
  })

  describe('fromIncomingViewingKey', function () {
    test('should match the address derived from the same seed', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromIncomingViewingKey(ivk).bytes())
        .toEqual(OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
    })

    test('should derive a different address per diversifier index', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromIncomingViewingKey(ivk, 7).bytes())
        .not.toEqual(OrchardAddressWASM.fromIncomingViewingKey(ivk, 0).bytes())
    })
  })

  describe('fromSeed scope', function () {
    test('should derive the internal-scope address', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT, 0, 'internal').bytes())
        .toEqual(OrchardAddressWASM.fromFullViewingKey(fvk, 0, 'internal').bytes())
    })
  })
})

describe('FullViewingKey', function () {
  describe('fromSeed', function () {
    test('should derive a 96-byte key deterministically', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(fvk).toBeInstanceOf(FullViewingKeyWASM)
      expect(fvk.bytes().length).toEqual(96)
      expect(fvk.bytes()).toEqual(FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
    })

    test('should differ per account', function () {
      expect(FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, 1).bytes())
        .not.toEqual(FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, 0).bytes())
    })

    test('should reject a hardened account index', function () {
      expect(() => FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, 0x80000000)).toThrow()
    })
  })

  describe('serialization', function () {
    test('should roundtrip through bytes', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(FullViewingKeyWASM.fromBytes(fvk.bytes()).bytes()).toEqual(fvk.bytes())
    })

    test('should reject bytes of the wrong length', function () {
      expect(() => FullViewingKeyWASM.fromBytes(new Uint8Array(64))).toThrow()
    })

    test('should reject bytes that are not a valid key', function () {
      expect(() => FullViewingKeyWASM.fromBytes(new Uint8Array(96).fill(0xff))).toThrow()
    })
  })

  describe('toOvk', function () {
    test('should match orchardOvkFromSeed for the external scope', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(fvk.toOvk()).toEqual(orchardOvkFromSeed(SEED, COIN_TYPE, ACCOUNT))
      expect(fvk.toOvk('internal')).not.toEqual(fvk.toOvk('external'))
    })
  })

  describe('toIvk', function () {
    test('should derive the same key as IncomingViewingKey.fromSeed', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(fvk.toIvk().bytes())
        .toEqual(IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
      expect(fvk.toIvk('internal').bytes()).not.toEqual(fvk.toIvk('external').bytes())
    })
  })

  describe('scopeForAddress', function () {
    test('should report the scope of its own addresses', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(fvk.scopeForAddress(fvk.address(0, 'external'))).toEqual('External')
      expect(fvk.scopeForAddress(fvk.address(0, 'internal'))).toEqual('Internal')
    })

    test('should return null for a foreign address', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const other = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, 1)

      expect(fvk.scopeForAddress(other.address())).toBeNull()
    })
  })
})

describe('IncomingViewingKey', function () {
  describe('fromSeed', function () {
    test('should derive a 64-byte key deterministically', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(ivk).toBeInstanceOf(IncomingViewingKeyWASM)
      expect(ivk.bytes().length).toEqual(64)
      expect(ivk.bytes()).toEqual(IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
    })
  })

  describe('fromFullViewingKey', function () {
    test('should match the key derived from the same seed', function () {
      const fvk = FullViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(IncomingViewingKeyWASM.fromFullViewingKey(fvk).bytes())
        .toEqual(IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT).bytes())
    })
  })

  describe('serialization', function () {
    test('should roundtrip through bytes', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(IncomingViewingKeyWASM.fromBytes(ivk.bytes()).bytes()).toEqual(ivk.bytes())
    })

    test('should reject bytes of the wrong length', function () {
      expect(() => IncomingViewingKeyWASM.fromBytes(new Uint8Array(96))).toThrow()
    })
  })

  describe('diversifierIndex', function () {
    test('should recover the index of its own address', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)

      expect(ivk.diversifierIndex(ivk.address(5))).toEqual(5)
    })

    test('should return null for a foreign address', function () {
      const ivk = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const other = IncomingViewingKeyWASM.fromSeed(SEED, COIN_TYPE, 1)

      expect(ivk.diversifierIndex(other.address())).toBeNull()
    })
  })
})

describe('Note', function () {
  describe('constructor', function () {
    test('should create a note from valid parts', function () {
      const note = createTestNote()

      expect(note).toBeInstanceOf(NoteWASM)
    })

    test('should reject an invalid rho', function () {
      const address = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const invalidRho = new Uint8Array(32).fill(0xff) // not a canonical field element
      const rseed = new Uint8Array(32).fill(0x42)

      expect(() => new NoteWASM(address, 1000n, invalidRho, rseed)).toThrow()
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const note = createTestNote(1234n)

      expect(note.address).toBeInstanceOf(OrchardAddressWASM)
      expect(note.value).toEqual(1234n)
      expect(note.rho.length).toEqual(32)
      expect(note.rseed.length).toEqual(32)
      expect(note.cmx.length).toEqual(32)
    })
  })

  describe('setters', function () {
    test('should set the value', function () {
      const note = createTestNote()

      note.value = 5000n
      expect(note.value).toEqual(5000n)
    })
  })
})

describe('CommitmentTree', function () {
  describe('append / witness / anchor', function () {
    test('should append a commitment and produce a witness and anchor', function () {
      const note = createTestNote()
      const tree = new CommitmentTreeWASM()

      tree.append(note.cmx, true)
      tree.checkpoint(1)

      expect(tree.maxLeafPosition()).toEqual(0)

      const path = tree.witness(0)
      expect(path).toBeInstanceOf(MerklePathWASM)
      expect(path!.authPath.length).toEqual(32)

      expect(tree.anchor().length).toEqual(32)
    })

    test('should reject a cmx that is not 32 bytes', function () {
      const tree = new CommitmentTreeWASM()

      expect(() => tree.append(new Uint8Array(16), true)).toThrow()
    })
  })
})

describe('MerklePath', function () {
  let position: number
  let authPath: Uint8Array[]

  beforeAll(function () {
    const note = createTestNote()
    const tree = new CommitmentTreeWASM()
    tree.append(note.cmx, true)
    tree.checkpoint(1)
    const path = tree.witness(0)!
    position = path.position
    authPath = path.authPath
  })

  describe('constructor', function () {
    test('should create a MerklePath from parts', function () {
      const path = new MerklePathWASM(position, authPath)

      expect(path).toBeInstanceOf(MerklePathWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const path = new MerklePathWASM(position, authPath)

      expect(path.position).toEqual(position)
      expect(path.authPath.length).toEqual(32)
      expect(path.authPath[0].length).toEqual(32)
    })
  })

  describe('setters', function () {
    test('should set the position', function () {
      const path = new MerklePathWASM(position, authPath)

      path.position = 0
      expect(path.position).toEqual(0)
    })
  })
})

describe('SpendableNote', function () {
  let note: NoteWASM
  let merklePath: MerklePathWASM

  beforeAll(function () {
    note = createTestNote()
    const tree = new CommitmentTreeWASM()
    tree.append(note.cmx, true)
    tree.checkpoint(1)
    merklePath = tree.witness(0)!
  })

  describe('constructor', function () {
    test('should create a SpendableNote from a note and witness', function () {
      const spendable = new SpendableNoteWASM(note, merklePath)

      expect(spendable).toBeInstanceOf(SpendableNoteWASM)
    })
  })

  describe('getters', function () {
    test('should return the note and merkle path', function () {
      const spendable = new SpendableNoteWASM(note, merklePath)

      expect(spendable.note).toBeInstanceOf(NoteWASM)
      expect(spendable.note.value).toEqual(note.value)
      expect(spendable.merklePath).toBeInstanceOf(MerklePathWASM)
      expect(spendable.merklePath.position).toEqual(merklePath.position)
    })
  })

  describe('setters', function () {
    test('should set the note', function () {
      const spendable = new SpendableNoteWASM(note, merklePath)
      const newNote = createTestNote(2000n)

      spendable.note = newNote
      expect(spendable.note.value).toEqual(2000n)
    })
  })
})

describe('OrchardProver', function () {
  // Initializing the prover builds the Halo 2 proving key (~seconds).
  test('should construct a prover', async function () {
    const prover = new OrchardProverWASM()
    await prover.init()

    expect(prover).toBeInstanceOf(OrchardProverWASM)
  }, 30000)
})

describe('ShieldedBuilder', function () {
  // The builder builds its own Halo 2 proving key on init (~seconds),
  // so build it once and reuse it across the deposit test.
  let builder: ShieldedBuilderWASM

  beforeAll(async function () {
    builder = new ShieldedBuilderWASM()
    await builder.init()
  }, 30000)

  describe('constructor', function () {
    test('should construct a builder', function () {
      expect(builder).toBeInstanceOf(ShieldedBuilderWASM)
    })
  })

  describe('shield (transparent -> pool deposit)', function () {
    test('should build and prove a shield transition', async function () {
      const recipient = OrchardAddressWASM.fromSeed(SEED, COIN_TYPE, ACCOUNT)
      const senderOvk = orchardOvkFromSeed(SEED, COIN_TYPE, ACCOUNT)

      const privateKey = PrivateKeyWASM.fromWIF(WIF)
      const inputAddress = platformAddressFromPrivateKey(privateKey)
      // address, nonce, balance — balance must cover amount + fee.
      const input = new InputAddressWASM(inputAddress, 0, DASH / 2n)

      const st = await builder.shield(
        recipient,
        (DASH * 4n) / 10n, // 0.4 DASH into the pool
        [input],
        [privateKey],
        [AddressFundsFeeStrategyStepWASM.DeductFromInput(0)],
        0, // user fee increase
        ShieldedMemoWASM.empty(),
        senderOvk
      )

      expect(st).toBeInstanceOf(StateTransitionWASM)

      const transition = ShieldTransitionWASM.fromStateTransition(st)
      expect(transition).toBeInstanceOf(ShieldTransitionWASM)
      expect(transition.amount).toEqual((DASH * 4n) / 10n)
      expect(transition.actions.length).toBeGreaterThanOrEqual(1)
      expect(transition.proof.length).toBeGreaterThan(0)
    }, 30000)
  })
})