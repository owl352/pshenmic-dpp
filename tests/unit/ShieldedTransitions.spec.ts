import {
  SerializedActionWASM,
  ShieldedTransferTransitionWASM,
  ShieldTransitionWASM,
  UnshieldTransitionWASM,
  ShieldFromAssetLockTransitionWASM,
  ShieldedWithdrawalTransitionWASM,
  IdentityCreateFromShieldedPoolTransitionWASM,
  InputAddressWASM,
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM,
  PlatformAddressWASM,
  AssetLockProofWASM,
  OutPointWASM,
  CoreScriptWASM,
  IdentityPublicKeyInCreationWASM,
  IdentifierWASM,
  Purpose,
  SecurityLevel,
  KeyType,
  StateTransitionWASM
} from 'pshenmic-dpp'

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

function createTestAddress (): PlatformAddressWASM {
  const addressBytes = new Uint8Array(21)
  addressBytes[0] = 0x00
  addressBytes.set(randomBytes(20), 1)
  return PlatformAddressWASM.fromBytes(addressBytes)
}

describe('SerializedAction', function () {
  let nullifier: Uint8Array
  let rk: Uint8Array
  let cmx: Uint8Array
  let encryptedNote: Uint8Array
  let cvNet: Uint8Array
  let spendAuthSig: Uint8Array

  beforeAll(function () {
    nullifier = randomBytes(32)
    rk = randomBytes(32)
    cmx = randomBytes(32)
    encryptedNote = randomBytes(580)
    cvNet = randomBytes(32)
    spendAuthSig = randomBytes(64)
  })

  describe('constructor', function () {
    test('should create SerializedAction from values', function () {
      const action = new SerializedActionWASM(nullifier, rk, cmx, encryptedNote, cvNet, spendAuthSig)

      expect(action).toBeInstanceOf(SerializedActionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const action = new SerializedActionWASM(nullifier, rk, cmx, encryptedNote, cvNet, spendAuthSig)

      expect(action.nullifier).toEqual(nullifier)
      expect(action.rk).toEqual(rk)
      expect(action.cmx).toEqual(cmx)
      expect(action.encryptedNote).toEqual(encryptedNote)
      expect(action.cvNet).toEqual(cvNet)
      expect(action.spendAuthSig).toEqual(spendAuthSig)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const action = new SerializedActionWASM(nullifier, rk, cmx, encryptedNote, cvNet, spendAuthSig)

      const newNullifier = randomBytes(32)
      const newRk = randomBytes(32)
      const newCmx = randomBytes(32)
      const newEncryptedNote = randomBytes(580)
      const newCvNet = randomBytes(32)
      const newSpendAuthSig = randomBytes(64)

      action.nullifier = newNullifier
      action.rk = newRk
      action.cmx = newCmx
      action.encryptedNote = newEncryptedNote
      action.cvNet = newCvNet
      action.spendAuthSig = newSpendAuthSig

      expect(action.nullifier).toEqual(newNullifier)
      expect(action.rk).toEqual(newRk)
      expect(action.cmx).toEqual(newCmx)
      expect(action.encryptedNote).toEqual(newEncryptedNote)
      expect(action.cvNet).toEqual(newCvNet)
      expect(action.spendAuthSig).toEqual(newSpendAuthSig)
    })
  })
})

describe('ShieldedTransferTransition', function () {
  let actions: SerializedActionWASM[]
  let valueBalance: bigint
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array

  beforeAll(function () {
    actions = [createTestAction()]
    valueBalance = BigInt(100000)
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
  })

  describe('constructor', function () {
    test('should create ShieldedTransferTransition from values', function () {
      const transition = new ShieldedTransferTransitionWASM(actions, valueBalance, anchor, proof, bindingsSignature)

      expect(transition).toBeInstanceOf(ShieldedTransferTransitionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new ShieldedTransferTransitionWASM(actions, valueBalance, anchor, proof, bindingsSignature)

      expect(transition.actions.length).toEqual(1)
      expect(transition.actions[0].nullifier).toEqual(actions[0].nullifier)
      expect(transition.valueBalance).toEqual(valueBalance)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new ShieldedTransferTransitionWASM(actions, valueBalance, anchor, proof, bindingsSignature)

      const newActions = [createTestAction(), createTestAction()]
      const newValueBalance = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)

      transition.actions = newActions
      transition.valueBalance = newValueBalance
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature

      expect(transition.actions.length).toEqual(2)
      expect(transition.valueBalance).toEqual(newValueBalance)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new ShieldedTransferTransitionWASM(actions, valueBalance, anchor, proof, bindingsSignature)

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = ShieldedTransferTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(ShieldedTransferTransitionWASM)

      expect(restored.valueBalance).toEqual(valueBalance)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
      expect(restored.actions.length).toEqual(1)
    })
  })
})

describe('ShieldTransition', function () {
  let inputs: InputAddressWASM[]
  let actions: SerializedActionWASM[]
  let amount: bigint
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array
  let feeStrategy: AddressFundsFeeStrategyStepWASM[]
  let userFeeIncrease: number
  let inputWitnesses: AddressWitnessWASM[]

  beforeAll(function () {
    const address = createTestAddress()
    inputs = [new InputAddressWASM(address, 0, BigInt(500000))]
    actions = [createTestAction()]
    amount = BigInt(100000)
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
    feeStrategy = [AddressFundsFeeStrategyStepWASM.DeductFromInput(0)]
    userFeeIncrease = 0
    inputWitnesses = [AddressWitnessWASM.P2PKH(randomBytes(65))]
  })

  describe('constructor', function () {
    test('should create ShieldTransition from values', function () {
      const transition = new ShieldTransitionWASM(
        inputs, actions, amount, anchor, proof, bindingsSignature, feeStrategy, userFeeIncrease, inputWitnesses
      )

      expect(transition).toBeInstanceOf(ShieldTransitionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new ShieldTransitionWASM(
        inputs, actions, amount, anchor, proof, bindingsSignature, feeStrategy, userFeeIncrease, inputWitnesses
      )

      expect(transition.inputs.length).toEqual(1)
      expect(transition.actions.length).toEqual(1)
      expect(transition.amount).toEqual(amount)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
      expect(transition.feeStrategy.length).toEqual(1)
      expect(transition.userFeeIncrease).toEqual(userFeeIncrease)
      expect(transition.inputWitnesses.length).toEqual(1)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new ShieldTransitionWASM(
        inputs, actions, amount, anchor, proof, bindingsSignature, feeStrategy, userFeeIncrease, inputWitnesses
      )

      const newAmount = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)
      const newUserFeeIncrease = 5

      transition.amount = newAmount
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature
      transition.userFeeIncrease = newUserFeeIncrease

      expect(transition.amount).toEqual(newAmount)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
      expect(transition.userFeeIncrease).toEqual(newUserFeeIncrease)
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new ShieldTransitionWASM(
        inputs, actions, amount, anchor, proof, bindingsSignature, feeStrategy, userFeeIncrease, inputWitnesses
      )

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = ShieldTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(ShieldTransitionWASM)

      expect(restored.amount).toEqual(amount)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
      expect(restored.userFeeIncrease).toEqual(userFeeIncrease)
      expect(restored.inputs.length).toEqual(1)
      expect(restored.actions.length).toEqual(1)
    })
  })
})

describe('UnshieldTransition', function () {
  let outputAddress: PlatformAddressWASM
  let actions: SerializedActionWASM[]
  let unshieldingAmount: bigint
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array

  beforeAll(function () {
    outputAddress = createTestAddress()
    actions = [createTestAction()]
    unshieldingAmount = BigInt(100000)
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
  })

  describe('constructor', function () {
    test('should create UnshieldTransition from values', function () {
      const transition = new UnshieldTransitionWASM(
        outputAddress, actions, unshieldingAmount, anchor, proof, bindingsSignature
      )

      expect(transition).toBeInstanceOf(UnshieldTransitionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new UnshieldTransitionWASM(
        outputAddress, actions, unshieldingAmount, anchor, proof, bindingsSignature
      )

      expect(transition.outputAddress).toBeInstanceOf(PlatformAddressWASM)
      expect(transition.outputAddress.bytes()).toEqual(outputAddress.bytes())
      expect(transition.actions.length).toEqual(1)
      expect(transition.unshieldingAmount).toEqual(unshieldingAmount)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new UnshieldTransitionWASM(
        outputAddress, actions, unshieldingAmount, anchor, proof, bindingsSignature
      )

      const newAddress = createTestAddress()
      const newAmount = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)

      transition.outputAddress = newAddress
      transition.unshieldingAmount = newAmount
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature

      expect(transition.outputAddress.bytes()).toEqual(newAddress.bytes())
      expect(transition.unshieldingAmount).toEqual(newAmount)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new UnshieldTransitionWASM(
        outputAddress, actions, unshieldingAmount, anchor, proof, bindingsSignature
      )

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = UnshieldTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(UnshieldTransitionWASM)

      expect(restored.outputAddress.bytes()).toEqual(outputAddress.bytes())
      expect(restored.unshieldingAmount).toEqual(unshieldingAmount)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
    })
  })
})

describe('ShieldFromAssetLockTransition', function () {
  let assetLockProof: AssetLockProofWASM
  let actions: SerializedActionWASM[]
  let valueBalance: bigint
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array

  beforeAll(function () {
    const txid = 'a'.repeat(64)
    const outPoint = new OutPointWASM(txid, 0)
    assetLockProof = AssetLockProofWASM.createChainAssetLockProof(100, outPoint)
    actions = [createTestAction()]
    valueBalance = BigInt(100000)
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
  })

  describe('constructor', function () {
    test('should create ShieldFromAssetLockTransition from values', function () {
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature
      )

      expect(transition).toBeInstanceOf(ShieldFromAssetLockTransitionWASM)
    })

    test('should create ShieldFromAssetLockTransition with surplusOutput', function () {
      const surplusOutput = createTestAddress()
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature, surplusOutput
      )

      expect(transition).toBeInstanceOf(ShieldFromAssetLockTransitionWASM)
      expect(transition.surplusOutput).toBeInstanceOf(PlatformAddressWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature
      )

      expect(transition.assetLockProof).toBeInstanceOf(AssetLockProofWASM)
      expect(transition.actions.length).toEqual(1)
      expect(transition.valueBalance).toEqual(valueBalance)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature
      )

      const newValueBalance = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)

      transition.valueBalance = newValueBalance
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature

      expect(transition.valueBalance).toEqual(newValueBalance)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
    })

    test('should set surplusOutput', function () {
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature
      )

      const surplusAddress = createTestAddress()
      transition.surplusOutput = surplusAddress

      expect(transition.surplusOutput).toBeInstanceOf(PlatformAddressWASM)
      expect(transition.surplusOutput!.bytes()).toEqual(surplusAddress.bytes())
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new ShieldFromAssetLockTransitionWASM(
        assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature
      )

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = ShieldFromAssetLockTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(ShieldFromAssetLockTransitionWASM)

      expect(restored.valueBalance).toEqual(valueBalance)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
      expect(restored.actions.length).toEqual(1)
    })
  })
})

describe('ShieldedWithdrawalTransition', function () {
  let actions: SerializedActionWASM[]
  let unshieldingAmount: bigint
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array
  let coreFeePerByte: number
  let outputScript: CoreScriptWASM

  beforeAll(function () {
    actions = [createTestAction()]
    unshieldingAmount = BigInt(100000)
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
    coreFeePerByte = 1
    outputScript = CoreScriptWASM.newP2PKH(randomBytes(20))
  })

  describe('constructor', function () {
    test('should create ShieldedWithdrawalTransition from values', function () {
      const transition = new ShieldedWithdrawalTransitionWASM(
        actions, unshieldingAmount, anchor, proof, bindingsSignature, coreFeePerByte, 'Never', outputScript
      )

      expect(transition).toBeInstanceOf(ShieldedWithdrawalTransitionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new ShieldedWithdrawalTransitionWASM(
        actions, unshieldingAmount, anchor, proof, bindingsSignature, coreFeePerByte, 'Never', outputScript
      )

      expect(transition.actions.length).toEqual(1)
      expect(transition.unshieldingAmount).toEqual(unshieldingAmount)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
      expect(transition.coreFeePerByte).toEqual(coreFeePerByte)
      expect(transition.pooling).toEqual('Never')
      expect(transition.outputScript).toBeInstanceOf(CoreScriptWASM)
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new ShieldedWithdrawalTransitionWASM(
        actions, unshieldingAmount, anchor, proof, bindingsSignature, coreFeePerByte, 'Never', outputScript
      )

      const newAmount = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)
      const newCoreFeePerByte = 2
      const newOutputScript = CoreScriptWASM.newP2PKH(randomBytes(20))

      transition.unshieldingAmount = newAmount
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature
      transition.coreFeePerByte = newCoreFeePerByte
      transition.pooling = 'Standard'
      transition.outputScript = newOutputScript

      expect(transition.unshieldingAmount).toEqual(newAmount)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
      expect(transition.coreFeePerByte).toEqual(newCoreFeePerByte)
      expect(transition.pooling).toEqual('Standard')
      expect(transition.outputScript.bytes()).toEqual(newOutputScript.bytes())
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new ShieldedWithdrawalTransitionWASM(
        actions, unshieldingAmount, anchor, proof, bindingsSignature, coreFeePerByte, 'Never', outputScript
      )

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = ShieldedWithdrawalTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(ShieldedWithdrawalTransitionWASM)

      expect(restored.unshieldingAmount).toEqual(unshieldingAmount)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
      expect(restored.coreFeePerByte).toEqual(coreFeePerByte)
      expect(restored.pooling).toEqual('Never')
    })
  })
})

describe('IdentityCreateFromShieldedPoolTransition', function () {
  let publicKeys: IdentityPublicKeyInCreationWASM[]
  let denomination: bigint
  let actions: SerializedActionWASM[]
  let anchor: Uint8Array
  let proof: Uint8Array
  let bindingsSignature: Uint8Array
  let sendToAddressOnCreationFailure: PlatformAddressWASM
  let identityId: IdentifierWASM

  beforeAll(function () {
    publicKeys = [
      new IdentityPublicKeyInCreationWASM(
        0,
        Purpose.AUTHENTICATION,
        SecurityLevel.MASTER,
        KeyType.ECDSA_SECP256K1,
        false,
        randomBytes(33)
      )
    ]
    denomination = BigInt(100000)
    actions = [createTestAction()]
    anchor = randomBytes(32)
    proof = randomBytes(192)
    bindingsSignature = randomBytes(64)
    sendToAddressOnCreationFailure = createTestAddress()
    identityId = IdentifierWASM.fromBytes(randomBytes(32))
  })

  describe('constructor', function () {
    test('should create IdentityCreateFromShieldedPoolTransition from values', function () {
      const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
        publicKeys, denomination, actions, anchor, proof, bindingsSignature,
        sendToAddressOnCreationFailure, identityId
      )

      expect(transition).toBeInstanceOf(IdentityCreateFromShieldedPoolTransitionWASM)
    })
  })

  describe('getters', function () {
    test('should return all fields', function () {
      const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
        publicKeys, denomination, actions, anchor, proof, bindingsSignature,
        sendToAddressOnCreationFailure, identityId
      )

      expect(transition.publicKeys.length).toEqual(1)
      expect(transition.denomination).toEqual(denomination)
      expect(transition.actions.length).toEqual(1)
      expect(transition.anchor).toEqual(anchor)
      expect(transition.proof).toEqual(proof)
      expect(transition.bindingsSignature).toEqual(bindingsSignature)
      expect(transition.sendToAddressOnCreationFailure).toBeInstanceOf(PlatformAddressWASM)
      expect(transition.sendToAddressOnCreationFailure.bytes()).toEqual(sendToAddressOnCreationFailure.bytes())
      expect(transition.identityId).toBeInstanceOf(IdentifierWASM)
      expect(transition.identityId.bytes()).toEqual(identityId.bytes())
    })
  })

  describe('setters', function () {
    test('should set all fields', function () {
      const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
        publicKeys, denomination, actions, anchor, proof, bindingsSignature,
        sendToAddressOnCreationFailure, identityId
      )

      const newDenomination = BigInt(200000)
      const newAnchor = randomBytes(32)
      const newProof = randomBytes(192)
      const newBindingsSignature = randomBytes(64)
      const newAddress = createTestAddress()
      const newIdentityId = IdentifierWASM.fromBytes(randomBytes(32))

      transition.denomination = newDenomination
      transition.anchor = newAnchor
      transition.proof = newProof
      transition.bindingsSignature = newBindingsSignature
      transition.sendToAddressOnCreationFailure = newAddress
      transition.identityId = newIdentityId

      expect(transition.denomination).toEqual(newDenomination)
      expect(transition.anchor).toEqual(newAnchor)
      expect(transition.proof).toEqual(newProof)
      expect(transition.bindingsSignature).toEqual(newBindingsSignature)
      expect(transition.sendToAddressOnCreationFailure.bytes()).toEqual(newAddress.bytes())
      expect(transition.identityId.bytes()).toEqual(newIdentityId.bytes())
    })
  })

  describe('serialization / deserialization', function () {
    test('should roundtrip through StateTransition', function () {
      const transition = new IdentityCreateFromShieldedPoolTransitionWASM(
        publicKeys, denomination, actions, anchor, proof, bindingsSignature,
        sendToAddressOnCreationFailure, identityId
      )

      const st = transition.toStateTransition()
      expect(st).toBeInstanceOf(StateTransitionWASM)

      const restored = IdentityCreateFromShieldedPoolTransitionWASM.fromStateTransition(st)
      expect(restored).toBeInstanceOf(IdentityCreateFromShieldedPoolTransitionWASM)

      expect(restored.denomination).toEqual(denomination)
      expect(restored.anchor).toEqual(anchor)
      expect(restored.proof).toEqual(proof)
      expect(restored.bindingsSignature).toEqual(bindingsSignature)
      expect(restored.publicKeys.length).toEqual(1)
      expect(restored.actions.length).toEqual(1)
      expect(restored.sendToAddressOnCreationFailure.bytes()).toEqual(sendToAddressOnCreationFailure.bytes())
      expect(restored.identityId.bytes()).toEqual(identityId.bytes())
    })
  })
})