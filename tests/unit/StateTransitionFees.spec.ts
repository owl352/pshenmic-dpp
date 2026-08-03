import {
  AssetLockProofWASM,
  BatchTransitionWASM,
  CoreScriptWASM,
  DataContractCreateTransitionWASM,
  DataContractWASM,
  IdentityCreateTransitionWASM,
  IdentityCreditTransferWASM,
  IdentityCreditWithdrawalTransitionWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityTopUpTransitionWASM,
  IdentityUpdateTransitionWASM,
  KeyType,
  OutPointWASM,
  Purpose,
  SecurityLevel,
  StateTransitionWASM
} from 'pshenmic-dpp'

// Min fees from the platform fee version (STATE_TRANSITION_MIN_FEES_VERSION1)
const CREDIT_TRANSFER_COST = BigInt(100000)
const CREDIT_WITHDRAWAL_COST = BigInt(400000000)
const IDENTITY_UPDATE_COST = BigInt(100000)
const CONTRACT_CREATE_COST = BigInt(100000)
const DOCUMENT_BATCH_SUB_TRANSITION_COST = BigInt(100000)
const IDENTITY_CREATE_BASE_COST = BigInt(2000000)
const IDENTITY_KEY_IN_CREATION_COST = BigInt(6500000)
const IDENTITY_TOPUP_BASE_COST = BigInt(500000)
// required asset lock duff balance × CREDITS_PER_DUFF (1000)
const IDENTITY_CREATE_ASSET_LOCK_COST = BigInt(200000) * BigInt(1000)
const IDENTITY_TOPUP_ASSET_LOCK_COST = BigInt(50000) * BigInt(1000)

// A signed document batch transition holding a single document create transition
const BATCH_TRANSITION_BASE64 = 'AgHv88sfWzscuW2Ob/0v5d+EgqmWG7ZIvlQG7mHWBH7z9gEAAAAB7JH7W+JkM0Vne2U1zlWYVeQNzRPTpdiWRfsgfwNS2UoCCGJsb2dQb3N0KBdMgeznVQ1smUXVFNPfE2PC379wpWVH8cdu2ilzeI0Ah/i2xfrKCm5ACQAbEQkSc+GRUkdLor4Eu7Vzf6oRc9UHBmJsb2dJZAogdhC4nVm3ufPCgdfoOKXtnhqwg7O3axyTS9WB3EFvNBYPY29tbWVudHNFbmFibGVkEwEHY29udGVudAr7AUh4nM2TTWrDMBCFrxK0jkCyJMvqLnRV6A1KFhpplJgotrEVaAi+e8clpdBuvCnNcn7ezPvQ6O3G2siemKgNSGETT8ZarhUm7hpX8yStEpVCk6xlW1auA1L34Ed/GP1wpNQw9sPEnm6s4Ht57nM/UkPE5C+5UBl8OB3G/tLF37VFscvtoTtjV6iSMRU2b1nou/KZIXf3jUvrXUHRrosbv8ltKRk30JbNl2LLpnLNuPiZ5z1NOrY5jtjRqP28vbM656zTleagJHCNXnIQiUIpgozGg2/0N2s4Yji9tlN5KXj+A97FJG1AcpZ8nnANv1wHGo22ASrFXQDJde0SBzDIdQBVRQEoDDw2aLUONPkKtfF0s9bR9bqGkJW3PNYCg/FOgIqPDarWgQrRxKapBXdCJ3pR7TjUVnJrpAo6yhSc/4dv+tPu/gNBt2qtC3B1Ymxpc2hlZEF0Av0AAAGcptJlIwRzbHVnEhV0aGlzLWlzLW15LWZpcnN0LXBvc3QIc3VidGl0bGUSD1dpdGggYSBzdWJ0aXRsZQV0aXRsZRIVVGhpcyBpcyBteSBmaXJzdCBwb3N0AAABQR+H40MbUEmFXQbTPcwy9vMD8EiTwDzMpW3YIkfSIDvHij5ZIAVvqm0ZJScJzKV7EnRUi/f1tZ/wFJfd1+LDtpps'

function randomBytes (length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

function createTestKey (): IdentityPublicKeyInCreationWASM {
  return new IdentityPublicKeyInCreationWASM(
    0,
    Purpose.AUTHENTICATION,
    SecurityLevel.MASTER,
    KeyType.ECDSA_SECP256K1,
    false,
    randomBytes(33)
  )
}

function createAssetLockProof (): AssetLockProofWASM {
  return AssetLockProofWASM.createChainAssetLockProof(100, new OutPointWASM('a'.repeat(64), 0))
}

describe('IdentityCreditTransferTransition fees', function () {
  test('calculateMinRequiredFee should return the credit transfer min fee', function () {
    const transition = new IdentityCreditTransferWASM(
      randomBytes(32), BigInt(100000), randomBytes(32), BigInt(1)
    )

    expect(transition.calculateMinRequiredFee()).toEqual(CREDIT_TRANSFER_COST)
  })
})

describe('IdentityCreditWithdrawalTransition fees', function () {
  test('calculateMinRequiredFee should return the credit withdrawal min fee', function () {
    const transition = new IdentityCreditWithdrawalTransitionWASM(
      randomBytes(32),
      BigInt(1000000),
      1,
      'Standard',
      BigInt(1),
      CoreScriptWASM.newP2PKH(randomBytes(20))
    )

    expect(transition.calculateMinRequiredFee()).toEqual(CREDIT_WITHDRAWAL_COST)
  })
})

describe('IdentityUpdateTransition fees', function () {
  test('calculateMinRequiredFee should return the identity update min fee', function () {
    const transition = new IdentityUpdateTransitionWASM(
      randomBytes(32), BigInt(1), BigInt(1), [createTestKey()], []
    )

    expect(transition.calculateMinRequiredFee()).toEqual(IDENTITY_UPDATE_COST)
  })
})

describe('IdentityCreateTransition fees', function () {
  test('calculateMinRequiredFee should price the base cost, asset lock and keys', function () {
    const transition = new IdentityCreateTransitionWASM([createTestKey()], createAssetLockProof())

    expect(transition.calculateMinRequiredFee()).toEqual(
      IDENTITY_CREATE_BASE_COST + IDENTITY_CREATE_ASSET_LOCK_COST + IDENTITY_KEY_IN_CREATION_COST
    )
  })

  test('calculateMinRequiredFee should grow with the key count', function () {
    const oneKey = new IdentityCreateTransitionWASM([createTestKey()], createAssetLockProof())
    const twoKeys = new IdentityCreateTransitionWASM(
      [createTestKey(), createTestKey()], createAssetLockProof()
    )

    expect(twoKeys.calculateMinRequiredFee() - oneKey.calculateMinRequiredFee())
      .toEqual(IDENTITY_KEY_IN_CREATION_COST)
  })
})

describe('IdentityTopUpTransition fees', function () {
  test('calculateMinRequiredFee should price the base cost and the asset lock', function () {
    const transition = new IdentityTopUpTransitionWASM(createAssetLockProof(), randomBytes(32))

    expect(transition.calculateMinRequiredFee())
      .toEqual(IDENTITY_TOPUP_BASE_COST + IDENTITY_TOPUP_ASSET_LOCK_COST)
  })
})

describe('BatchTransition fees', function () {
  test('calculateMinRequiredFee should price each sub transition', function () {
    const batch = BatchTransitionWASM.fromStateTransition(
      StateTransitionWASM.fromBase64(BATCH_TRANSITION_BASE64)
    )

    expect(batch.calculateMinRequiredFee())
      .toEqual(DOCUMENT_BATCH_SUB_TRANSITION_COST * BigInt(batch.transitions.length))
  })
})

describe('StateTransition fees', function () {
  test('calculateMinRequiredFee should match the concrete transition', function () {
    const transition = new IdentityCreditTransferWASM(
      randomBytes(32), BigInt(100000), randomBytes(32), BigInt(1)
    )

    expect(transition.toStateTransition().calculateMinRequiredFee())
      .toEqual(transition.calculateMinRequiredFee())
  })

  test('calculateMinRequiredFee should work for a deserialized transition', function () {
    const stateTransition = StateTransitionWASM.fromBase64(BATCH_TRANSITION_BASE64)

    expect(stateTransition.calculateMinRequiredFee())
      .toEqual(DOCUMENT_BATCH_SUB_TRANSITION_COST)
  })
})

describe('DataContractCreateTransition fees', function () {
  const OWNER_ID_BASE58 = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
  const DOCUMENT_SCHEMA = {
    note: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          position: 0
        }
      },
      additionalProperties: false
    }
  }

  test('calculateMinRequiredFee should cover the base fee plus the registration cost', function () {
    const contract = new DataContractWASM(
      OWNER_ID_BASE58, BigInt(1), DOCUMENT_SCHEMA, undefined, undefined, true
    )
    const transition = new DataContractCreateTransitionWASM(contract, BigInt(1))

    expect(transition.calculateMinRequiredFee()).toBeGreaterThanOrEqual(CONTRACT_CREATE_COST)
    expect(transition.calculateMinRequiredFee())
      .toEqual(transition.toStateTransition().calculateMinRequiredFee())
  })
})
