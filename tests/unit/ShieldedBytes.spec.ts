import {
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM,
  AssetLockProofWASM,
  CoreScriptWASM,
  GroupStateTransitionInfoWASM,
  IdentifierWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityPublicKeyWASM,
  IdentityWASM,
  InputAddressWASM,
  KeyType,
  NetworkWASM,
  OutPointWASM,
  PlatformAddressWASM,
  PrivateKeyWASM,
  Purpose,
  SecurityLevel,
  SerializedActionWASM,
  ShieldedMemoWASM,
  ShieldedTransferTransitionWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'

// Bytes round-trips for the classes that cross the base <-> shielded boundary
// (smart-A1). Heavy orchard data classes (OrchardAddress, SpendableNote, Note,
// MerklePath, viewing keys, CommitmentTree, ShieldedOutput) are shielded-local
// class refs and intentionally NOT covered here. PlatformVersion is a scalar
// enum and crosses as a plain value.

// Deterministic byte fixtures (no Math.random, so failures reproduce).
function bytes (length: number, fill: number = 0xAB): Uint8Array {
  return new Uint8Array(length).fill(fill)
}

function createTestAction (): SerializedActionWASM {
  return new SerializedActionWASM(
    bytes(32, 0x01),
    bytes(32, 0x02),
    bytes(32, 0x03),
    bytes(580, 0x04),
    bytes(32, 0x05),
    bytes(64, 0x06)
  )
}

function createTestAddress (): PlatformAddressWASM {
  const addressBytes = new Uint8Array(21)
  addressBytes[0] = 0x00 // P2PKH
  addressBytes.set(bytes(20, 0x07), 1)
  return PlatformAddressWASM.fromBytes(addressBytes)
}

describe('boundary bytes round-trips', function () {
  describe('StateTransition (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const transition = new ShieldedTransferTransitionWASM(
        [createTestAction()], BigInt(100000), bytes(32, 0x10), bytes(192, 0x11), bytes(64, 0x12)
      ).toStateTransition()

      const roundTripped = StateTransitionWASM.fromBytes(transition.bytes())

      expect(roundTripped.bytes()).toEqual(transition.bytes())
    })
  })

  describe('Identity (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const identity = new IdentityWASM('HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')

      const roundTripped = IdentityWASM.fromBytes(identity.bytes())

      expect(roundTripped.bytes()).toEqual(identity.bytes())
    })
  })

  describe('IdentityPublicKey (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const key = new IdentityPublicKeyWASM(
        0, Purpose.AUTHENTICATION, SecurityLevel.MASTER, KeyType.ECDSA_SECP256K1, false,
        Buffer.from(bytes(33, 0x21)).toString('hex')
      )

      const roundTripped = IdentityPublicKeyWASM.fromBytes(key.bytes())

      expect(roundTripped.bytes()).toEqual(key.bytes())
    })
  })

  describe('IdentityPublicKeyInCreation', function () {
    test('fromBytes(bytes()).bytes() equals bytes() (V0)', function () {
      const key = new IdentityPublicKeyInCreationWASM(
        0, Purpose.AUTHENTICATION, SecurityLevel.MASTER, KeyType.ECDSA_SECP256K1, false, bytes(33, 0x21)
      )

      const roundTripped = IdentityPublicKeyInCreationWASM.fromBytes(key.bytes())

      expect(roundTripped.bytes()).toEqual(key.bytes())
      expect(roundTripped.keyId).toEqual(key.keyId)
      expect(roundTripped.data).toEqual(key.data)
    })

    test('fromBytes(bytes()).bytes() equals bytes() (V1 with limits)', function () {
      const key = new IdentityPublicKeyInCreationWASM(
        1, Purpose.AUTHENTICATION, SecurityLevel.HIGH, KeyType.ECDSA_SECP256K1, false,
        bytes(33, 0x22), bytes(64, 0x23), undefined, BigInt(42), BigInt(1700000000000)
      )

      const roundTripped = IdentityPublicKeyInCreationWASM.fromBytes(key.bytes())

      expect(roundTripped.bytes()).toEqual(key.bytes())
      expect(roundTripped.totalBudget).toEqual(BigInt(42))
      expect(roundTripped.expiresAt).toEqual(BigInt(1700000000000))
    })
  })

  describe('PrivateKey (already present)', function () {
    test('fromBytes(bytes(), network).bytes() equals bytes()', function () {
      const key = PrivateKeyWASM.fromWIF('cUy4wbim4y9NDwC24omx8oWY5WqfmjSU2gdcZtTXza2xDCAkQXRP')

      const roundTripped = PrivateKeyWASM.fromBytes(key.bytes(), NetworkWASM.Testnet)

      expect(roundTripped.bytes()).toEqual(key.bytes())
    })
  })

  describe('AssetLockProof', function () {
    // The pre-existing hex()/fromHex() pair is NOT a usable round-trip: hex()
    // encodes the platform Value debug shape, fromHex() expects tagged JSON.
    // bytes()/fromBytes() use the domain bincode format instead.
    test('fromBytes(bytes()).bytes() equals bytes() (chain)', function () {
      const proof = AssetLockProofWASM.createChainAssetLockProof(100, new OutPointWASM('a'.repeat(64), 0))

      const roundTripped = AssetLockProofWASM.fromBytes(proof.bytes())

      expect(roundTripped.bytes()).toEqual(proof.bytes())
      expect(roundTripped.getLockType()).toEqual(proof.getLockType())
    })
  })

  describe('CoreScript (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const script = CoreScriptWASM.newP2PKH(bytes(20, 0x31))

      const roundTripped = CoreScriptWASM.fromBytes(script.bytes())

      expect(roundTripped.bytes()).toEqual(script.bytes())
    })
  })

  describe('InputAddress', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const input = new InputAddressWASM(createTestAddress(), 7, BigInt(1_000_000))

      const roundTripped = InputAddressWASM.fromBytes(input.bytes())

      expect(roundTripped.bytes()).toEqual(input.bytes())
      expect(roundTripped.address.bytes()).toEqual(input.address.bytes())
      expect(roundTripped.nonce).toEqual(7)
      expect(roundTripped.credits).toEqual(BigInt(1_000_000))
    })
  })

  describe('AddressFundsFeeStrategyStep', function () {
    test('fromBytes(bytes()).bytes() equals bytes() (DeductFromInput)', function () {
      const step = AddressFundsFeeStrategyStepWASM.DeductFromInput(3)

      const roundTripped = AddressFundsFeeStrategyStepWASM.fromBytes(step.bytes())

      expect(roundTripped.bytes()).toEqual(step.bytes())
      expect(roundTripped.getValueType()).toEqual('DeductFromInput')
      expect(roundTripped.getValue()).toEqual(3)
    })

    test('fromBytes(bytes()).bytes() equals bytes() (ReduceOutput)', function () {
      const step = AddressFundsFeeStrategyStepWASM.ReduceOutput(5)

      const roundTripped = AddressFundsFeeStrategyStepWASM.fromBytes(step.bytes())

      expect(roundTripped.bytes()).toEqual(step.bytes())
      expect(roundTripped.getValueType()).toEqual('ReduceOutput')
      expect(roundTripped.getValue()).toEqual(5)
    })
  })

  describe('AddressWitness', function () {
    test('fromBytes(bytes()).bytes() equals bytes() (P2PKH)', function () {
      const witness = AddressWitnessWASM.P2PKH(bytes(65, 0x41))

      const roundTripped = AddressWitnessWASM.fromBytes(witness.bytes())

      expect(roundTripped.bytes()).toEqual(witness.bytes())
      expect(roundTripped.getType()).toEqual('P2PKH')
      expect(roundTripped.getValue()).toEqual(witness.getValue())
    })

    test('fromBytes(bytes()).bytes() equals bytes() (P2SH)', function () {
      const witness = AddressWitnessWASM.P2SH([bytes(65, 0x42), bytes(65, 0x43)], bytes(35, 0x44))

      const roundTripped = AddressWitnessWASM.fromBytes(witness.bytes())

      expect(roundTripped.bytes()).toEqual(witness.bytes())
      expect(roundTripped.getType()).toEqual('P2SH')
      expect(roundTripped.getValue()).toEqual(witness.getValue())
    })
  })

  describe('PlatformAddress (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const address = createTestAddress()

      const roundTripped = PlatformAddressWASM.fromBytes(address.bytes())

      expect(roundTripped.bytes()).toEqual(address.bytes())
    })
  })

  describe('Identifier (already present)', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const identifier = new IdentifierWASM(bytes(32, 0x51))

      const roundTripped = IdentifierWASM.fromBytes(identifier.bytes())

      expect(roundTripped.bytes()).toEqual(identifier.bytes())
    })
  })

  describe('GroupStateTransitionInfo', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const info = new GroupStateTransitionInfoWASM(2, bytes(32, 0x61), true)

      const roundTripped = GroupStateTransitionInfoWASM.fromBytes(info.bytes())

      expect(roundTripped.bytes()).toEqual(info.bytes())
      expect(roundTripped.groupContractPosition).toEqual(2)
      expect(roundTripped.actionId.bytes()).toEqual(info.actionId.bytes())
      expect(roundTripped.actionIsProposer).toEqual(true)
    })
  })

  describe('ShieldedMemo', function () {
    test('fromBytes(toBytes()).toBytes() equals toBytes() (empty)', function () {
      const memo = ShieldedMemoWASM.empty()

      const roundTripped = ShieldedMemoWASM.fromBytes(memo.toBytes())

      expect(roundTripped.toBytes()).toEqual(memo.toBytes())
      expect(roundTripped.toString()).toEqual('')
    })

    test('fromBytes(toBytes()).toBytes() equals toBytes() (text)', function () {
      const memo = ShieldedMemoWASM.fromString('boundary memo')

      const roundTripped = ShieldedMemoWASM.fromBytes(memo.toBytes())

      expect(roundTripped.toBytes()).toEqual(memo.toBytes())
      expect(roundTripped.toString()).toEqual('boundary memo')
    })

    test('fromBytes(toBytes()).toBytes() equals toBytes() (other)', function () {
      const memo = ShieldedMemoWASM.other(0x2A, bytes(32, 0x71))

      const roundTripped = ShieldedMemoWASM.fromBytes(memo.toBytes())

      expect(roundTripped.toBytes()).toEqual(memo.toBytes())
    })

    test('fromBytes rejects a wrong-length payload', function () {
      // MEMO_SIZE is 36; the error must name the expected length, not just throw
      expect(() => ShieldedMemoWASM.fromBytes(bytes(35))).toThrow(/36/)
    })
  })

  describe('SerializedAction', function () {
    test('fromBytes(bytes()).bytes() equals bytes()', function () {
      const action = createTestAction()

      const roundTripped = SerializedActionWASM.fromBytes(action.bytes())

      expect(roundTripped.bytes()).toEqual(action.bytes())
      expect(roundTripped.nullifier).toEqual(action.nullifier)
      expect(roundTripped.rk).toEqual(action.rk)
      expect(roundTripped.cmx).toEqual(action.cmx)
      expect(roundTripped.encryptedNote).toEqual(action.encryptedNote)
      expect(roundTripped.cvNet).toEqual(action.cvNet)
      expect(roundTripped.spendAuthSig).toEqual(action.spendAuthSig)
    })
  })
})