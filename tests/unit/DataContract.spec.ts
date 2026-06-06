import {AuthorizedActionTakersWASM, ChangeControlRulesWASM, DataContractWASM,
  DistributionFunctionWASM, IdentifierWASM, PlatformVersionWASM,
  RewardDistributionTypeWASM, TokenConfigurationConventionWASM, TokenConfigurationLocalizationWASM,
  TokenConfigurationWASM,
  TokenDistributionRecipientWASM, TokenDistributionRulesWASM, TokenKeepsHistoryRulesWASM,
  TokenMarketplaceRulesWASM, TokenPerpetualDistributionWASM,
  TokenTradeModeWASM} from 'pshenmic-dpp'
import {buildTokenConfiguration} from './utils/buildTokenConfiguration.js'

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

describe('DataContract', function () {
  describe('constructor', function () {
    test('should create a contract with document schemas only', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      expect(contract).toBeInstanceOf(DataContractWASM)
      expect(contract.ownerId.base58()).toEqual(OWNER_ID_BASE58)
      expect(contract.tokens.length).toEqual(0)
      expect(Object.keys(contract.getSchemas())).toEqual(['note'])
    })

    test('should create a tokens-only contract (no document schemas)', function () {
      const tokenConfig = buildTokenConfiguration()

      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        {},
        undefined,
        [{position: 0, tokenConfiguration: tokenConfig}],
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      expect(contract).toBeInstanceOf(DataContractWASM)
      expect(contract.tokens.length).toEqual(1)
      expect(contract.tokens[0].position).toEqual(0)
      expect(contract.tokens[0].tokenConfiguration.baseSupply).toEqual(BigInt(100000))
    })

    test('should fail to create a contract with neither documents nor tokens', function () {
      expect(() => new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        {},
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )).toThrow()
    })

    test('should create a contract with both documents and tokens', function () {
      const tokenConfig = buildTokenConfiguration({baseSupply: BigInt(50)})

      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        [{position: 0, tokenConfiguration: tokenConfig}],
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      expect(contract.tokens.length).toEqual(1)
      expect(Object.keys(contract.getSchemas())).toEqual(['note'])
    })

    test('should generate a deterministic id from owner id and nonce', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(42),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const expectedId = DataContractWASM.generateId(OWNER_ID_BASE58, BigInt(42))

      expect(contract.id.base58()).toEqual(expectedId.base58())
    })
  })

  describe('serialization', function () {
    test('should serialize / deserialize via bytes', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const bytes = contract.bytes(PlatformVersionWASM.PLATFORM_V10)
      const restored = DataContractWASM.fromBytes(bytes, true, PlatformVersionWASM.PLATFORM_V10)

      expect(restored.id.base58()).toEqual(contract.id.base58())
      expect(restored.ownerId.base58()).toEqual(contract.ownerId.base58())
    })

    test('should serialize / deserialize a tokens-only contract via bytes', function () {
      const tokenConfig = buildTokenConfiguration()

      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        {},
        undefined,
        [{position: 0, tokenConfiguration: tokenConfig}],
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const bytes = contract.bytes(PlatformVersionWASM.PLATFORM_V10)
      const restored = DataContractWASM.fromBytes(bytes, true, PlatformVersionWASM.PLATFORM_V10)

      expect(restored.tokens.length).toEqual(1)
      expect(restored.tokens[0].tokenConfiguration.baseSupply).toEqual(tokenConfig.baseSupply)
    })

    test('should round-trip via hex', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const hex = contract.hex(PlatformVersionWASM.PLATFORM_V10)
      const restored = DataContractWASM.fromHex(hex, true, PlatformVersionWASM.PLATFORM_V10)

      expect(restored.id.base58()).toEqual(contract.id.base58())
    })

    test('should round-trip via base64', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const b64 = contract.base64(PlatformVersionWASM.PLATFORM_V10)
      const restored = DataContractWASM.fromBase64(b64, true, PlatformVersionWASM.PLATFORM_V10)

      expect(restored.id.base58()).toEqual(contract.id.base58())
    })
  })

  describe('mutators', function () {
    test('should allow setting tokens after construction', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      expect(contract.tokens.length).toEqual(0)

      contract.tokens = [{position: 0, tokenConfiguration: buildTokenConfiguration()}]

      expect(contract.tokens.length).toEqual(1)
    })

    test('should allow setting and reading description / keywords', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      contract.description = 'test contract'
      contract.keywords = ['alpha', 'beta']

      expect(contract.description).toEqual('test contract')
      expect(contract.keywords).toEqual(['alpha', 'beta'])
    })

    test('should allow changing the owner id', function () {
      const contract = new DataContractWASM(
        OWNER_ID_BASE58,
        BigInt(1),
        DOCUMENT_SCHEMA,
        undefined,
        undefined,
        true,
        PlatformVersionWASM.PLATFORM_V10
      )

      const newOwner = new IdentifierWASM('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      contract.ownerId = newOwner

      expect(contract.ownerId.base58()).toEqual(newOwner.base58())
    })
  })

  describe('tokens', function () {
    test('should allow setting tokens after construction', function () {
      const owner = '8J8k9aQ5Hotx8oLdnYAhYpyBJJGg4wZALptKLuDE9Df6'
      const taker = () => AuthorizedActionTakersWASM.ContractOwner()
      const rule = () => new ChangeControlRulesWASM(taker(), taker(), false, false, false)

      const conventions = new TokenConfigurationConventionWASM(
        {en: new TokenConfigurationLocalizationWASM(true, 'Tok', 'Toks')}, 8)

      const perpetual = new TokenPerpetualDistributionWASM(
        RewardDistributionTypeWASM.EpochBasedDistribution(1, DistributionFunctionWASM.FixedAmountDistribution(1n)),
        TokenDistributionRecipientWASM.Identity(IdentifierWASM.fromBase58(owner))) // <- swap to .ContractOwner() => passes

      const distributionRules = new TokenDistributionRulesWASM(
        rule(), rule(), true, rule(), rule(), perpetual, undefined, undefined)

      const tokenConfiguration = new TokenConfigurationWASM(
        conventions, rule(), 100n,
        new TokenKeepsHistoryRulesWASM(true, true, true, true, true, true),
        false, false, rule(), distributionRules,
        new TokenMarketplaceRulesWASM(TokenTradeModeWASM.NotTradeable(), rule()),
        rule(), rule(), rule(), rule(), rule(), rule(),
        taker(), undefined, undefined, undefined)

      const contract = new DataContractWASM(owner, 1n, {note: {}}, undefined,
        [{position: 0, tokenConfiguration}], true, undefined)

      expect(contract).toBeInstanceOf(DataContractWASM)
      expect(contract.tokens.length).toEqual(1)
      expect(contract.tokens[0].position).toEqual(0)

      const perpetualDistribution = contract.tokens[0].tokenConfiguration
        .distributionRules.perpetualDistribution

      expect(perpetualDistribution).toBeDefined()

      const recipient = perpetualDistribution!.distributionRecipient

      expect(recipient.getType()).toEqual(`Identity(${owner})`)
      expect(recipient.getValue()?.base58()).toEqual(owner)
    })
  })
})
