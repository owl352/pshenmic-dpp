import {
  AddressCreditWithdrawalTransitionWASM,
  AddressFundingFromAssetLockTransitionWASM,
  AddressFundsFeeStrategyStepWASM,
  AddressFundsTransferTransitionWASM,
  AddressWitnessWASM,
  AssetLockProofWASM,
  CoreScriptWASM,
  IdentityCreateFromAddressesTransitionWASM,
  IdentityCreditTransferToAddressesTransitionWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityTopUpFromAddressesTransitionWASM,
  InputAddressWASM,
  KeyType,
  OutPointWASM,
  OutputAddressNullableCreditsWASM,
  OutputAddressWASM,
  PlatformAddressWASM,
  PlatformVersionWASM,
  Purpose,
  SecurityLevel
} from 'pshenmic-dpp'

// Min fee components from the platform fee version (STATE_TRANSITION_MIN_FEES_VERSION1)
// Storage charged by the node for one address balance entry that does not exist yet,
// as pinned by platform's own fee regression suite.
const NEW_ADDRESS_STORAGE_FEE = BigInt(6075000)
const INPUT_COST = BigInt(500000)
const OUTPUT_COST = BigInt(6000000)
const ADDRESS_CREDIT_WITHDRAWAL_COST = BigInt(400000000)
const IDENTITY_CREATE_BASE_COST = BigInt(2000000)
const IDENTITY_KEY_IN_CREATION_COST = BigInt(6500000)
const IDENTITY_TOPUP_BASE_COST = BigInt(500000)
const CREDIT_TRANSFER_TO_ADDRESSES_COST = BigInt(500000)

function randomBytes (length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

function createTestAddress (): PlatformAddressWASM {
  const addressBytes = new Uint8Array(21)
  addressBytes[0] = 0x00
  addressBytes.set(randomBytes(20), 1)
  return PlatformAddressWASM.fromBytes(addressBytes)
}

function createTestInputs (count: number): InputAddressWASM[] {
  return Array.from(
    { length: count },
    () => new InputAddressWASM(createTestAddress(), 0, BigInt(500000000))
  )
}

function createTestOutputs (count: number): OutputAddressWASM[] {
  return Array.from(
    { length: count },
    () => new OutputAddressWASM(createTestAddress(), BigInt(100000))
  )
}

function createTestWitnesses (count: number): AddressWitnessWASM[] {
  return Array.from({ length: count }, () => AddressWitnessWASM.P2PKH(randomBytes(65)))
}

const feeStrategy = (): AddressFundsFeeStrategyStepWASM[] =>
  [AddressFundsFeeStrategyStepWASM.DeductFromInput(0)]

describe('AddressFundsTransferTransition fees', function () {
  describe('estimateMinFee', function () {
    test('should price inputs and outputs', function () {
      expect(AddressFundsTransferTransitionWASM.estimateMinFee(1, 1))
        .toEqual(INPUT_COST + OUTPUT_COST)

      expect(AddressFundsTransferTransitionWASM.estimateMinFee(2, 3))
        .toEqual(INPUT_COST * BigInt(2) + OUTPUT_COST * BigInt(3))
    })

    test('should charge at least one output', function () {
      expect(AddressFundsTransferTransitionWASM.estimateMinFee(1, 0))
        .toEqual(AddressFundsTransferTransitionWASM.estimateMinFee(1, 1))
    })

    test('should grow with the input and output counts', function () {
      const one = AddressFundsTransferTransitionWASM.estimateMinFee(1, 1)
      const two = AddressFundsTransferTransitionWASM.estimateMinFee(2, 2)

      expect(two).toBeGreaterThan(one)
    })

    test('should default to the latest platform version', function () {
      expect(AddressFundsTransferTransitionWASM.estimateMinFee(1, 1))
        .toEqual(AddressFundsTransferTransitionWASM.estimateMinFee(1, 1, PlatformVersionWASM.PLATFORM_V13))
    })
  })

  describe('calculateMinRequiredFee', function () {
    test('should match the estimate for the transition inputs and outputs', function () {
      const transition = new AddressFundsTransferTransitionWASM(
        createTestInputs(2),
        feeStrategy(),
        0,
        createTestWitnesses(2),
        createTestOutputs(1)
      )

      expect(transition.calculateMinRequiredFee())
        .toEqual(AddressFundsTransferTransitionWASM.estimateMinFee(2, 1))
    })
  })
})

describe('AddressCreditWithdrawalTransition fees', function () {
  const outputScript = (): CoreScriptWASM => CoreScriptWASM.newP2PKH(randomBytes(20))

  describe('estimateMinFee', function () {
    test('should price the withdrawal, its inputs and its change output', function () {
      expect(AddressCreditWithdrawalTransitionWASM.estimateMinFee(1, false))
        .toEqual(ADDRESS_CREDIT_WITHDRAWAL_COST + INPUT_COST)

      expect(AddressCreditWithdrawalTransitionWASM.estimateMinFee(1, true))
        .toEqual(ADDRESS_CREDIT_WITHDRAWAL_COST + INPUT_COST + OUTPUT_COST)
    })

    test('should grow with the input count', function () {
      expect(AddressCreditWithdrawalTransitionWASM.estimateMinFee(2, false))
        .toBeGreaterThan(AddressCreditWithdrawalTransitionWASM.estimateMinFee(1, false))
    })
  })

  describe('calculateMinRequiredFee', function () {
    test('should match the estimate without a change output', function () {
      const transition = new AddressCreditWithdrawalTransitionWASM(
        createTestInputs(1),
        feeStrategy(),
        1,
        'Standard',
        outputScript(),
        0,
        createTestWitnesses(1)
      )

      expect(transition.calculateMinRequiredFee())
        .toEqual(AddressCreditWithdrawalTransitionWASM.estimateMinFee(1, false))
    })

    test('should match the estimate with a change output', function () {
      const transition = new AddressCreditWithdrawalTransitionWASM(
        createTestInputs(1),
        feeStrategy(),
        1,
        'Standard',
        outputScript(),
        0,
        createTestWitnesses(1),
        createTestOutputs(1)[0]
      )

      expect(transition.calculateMinRequiredFee())
        .toEqual(AddressCreditWithdrawalTransitionWASM.estimateMinFee(1, true))
    })
  })
})

describe('IdentityCreateFromAddressesTransition fees', function () {
  test('calculateMinRequiredFee should price the base cost, inputs, output and keys', function () {
    const publicKeys = [
      new IdentityPublicKeyInCreationWASM(
        0,
        Purpose.AUTHENTICATION,
        SecurityLevel.MASTER,
        KeyType.ECDSA_SECP256K1,
        false,
        randomBytes(33)
      )
    ]

    const transition = new IdentityCreateFromAddressesTransitionWASM(
      publicKeys,
      createTestInputs(1),
      feeStrategy(),
      0,
      createTestWitnesses(1),
      createTestOutputs(1)[0]
    )

    expect(transition.calculateMinRequiredFee()).toEqual(
      IDENTITY_CREATE_BASE_COST + INPUT_COST + OUTPUT_COST + IDENTITY_KEY_IN_CREATION_COST
    )
  })
})

describe('IdentityTopUpFromAddressesTransition fees', function () {
  test('calculateMinRequiredFee should price the base cost, inputs and output', function () {
    const transition = new IdentityTopUpFromAddressesTransitionWASM(
      randomBytes(32),
      createTestInputs(1),
      feeStrategy(),
      0,
      createTestWitnesses(1),
      createTestOutputs(1)[0]
    )

    expect(transition.calculateMinRequiredFee())
      .toEqual(IDENTITY_TOPUP_BASE_COST + INPUT_COST + OUTPUT_COST)
  })
})

describe('IdentityCreditTransferToAddressesTransition fees', function () {
  test('calculateMinRequiredFee should price the base cost and each recipient', function () {
    const transition = new IdentityCreditTransferToAddressesTransitionWASM(
      randomBytes(32),
      createTestOutputs(2),
      BigInt(1),
      0
    )

    expect(transition.calculateMinRequiredFee())
      .toEqual(CREDIT_TRANSFER_TO_ADDRESSES_COST + OUTPUT_COST * BigInt(2))
  })
})

describe('AddressFundingFromAssetLockTransition fees', function () {
  test('calculateMinRequiredFee should include the asset lock base cost', function () {
    const outPoint = new OutPointWASM('a'.repeat(64), 0)
    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(100, outPoint)

    const transition = new AddressFundingFromAssetLockTransitionWASM(
      assetLockProof,
      createTestInputs(1),
      feeStrategy(),
      0,
      createTestWitnesses(1),
      [new OutputAddressNullableCreditsWASM(createTestAddress(), BigInt(100000))]
    )

    const fee = transition.calculateMinRequiredFee()

    expect(typeof fee).toEqual('bigint')
    expect(fee).toBeGreaterThan(INPUT_COST + OUTPUT_COST)
  })
})

describe('new address storage fee', function () {
  test('should match the storage the node charges for one created address', function () {
    expect(PlatformAddressWASM.estimateStorageFeeForNewAddresses(1))
      .toEqual(NEW_ADDRESS_STORAGE_FEE)
  })

  test('should scale with the number of created addresses', function () {
    expect(PlatformAddressWASM.estimateStorageFeeForNewAddresses(0)).toEqual(BigInt(0))
    expect(PlatformAddressWASM.estimateStorageFeeForNewAddresses(3))
      .toEqual(NEW_ADDRESS_STORAGE_FEE * BigInt(3))
  })

  test('should default to the latest platform version', function () {
    expect(PlatformAddressWASM.estimateStorageFeeForNewAddresses(1))
      .toEqual(PlatformAddressWASM.estimateStorageFeeForNewAddresses(1, PlatformVersionWASM.PLATFORM_V13))
  })

  test('should exceed the per output component of the min fee', function () {
    const perOutput =
      AddressFundsTransferTransitionWASM.estimateMinFee(1, 2) -
      AddressFundsTransferTransitionWASM.estimateMinFee(1, 1)

    // The min fee prices an output slightly below what a created address costs in storage,
    // which is why a transfer paying a brand new address is charged a little more than its
    // minimum required fee.
    expect(NEW_ADDRESS_STORAGE_FEE).toBeGreaterThan(perOutput)
  })
})
