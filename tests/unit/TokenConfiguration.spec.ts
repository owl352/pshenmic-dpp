import {
  AuthorizedActionTakersWASM,
  IdentifierWASM,
  TokenConfigurationWASM
} from 'pshenmic-dpp'
import { buildTokenConfiguration } from './utils/buildTokenConfiguration'

describe('TokenConfiguration', function () {
  describe('constructor', function () {
    test('should build a token configuration with defaults from the helper', function () {
      const config = buildTokenConfiguration()

      expect(config).toBeInstanceOf(TokenConfigurationWASM)
      expect(config.baseSupply).toEqual(BigInt(100000))
      expect(config.maxSupply).toBeUndefined()
      expect(config.description).toBeUndefined()
      expect(config.startAsPaused).toEqual(false)
      expect(config.isAllowedTransferToFrozenBalance).toEqual(false)
    })

    test('should set max supply and description when provided', function () {
      const config = buildTokenConfiguration({
        baseSupply: BigInt(500),
        maxSupply: BigInt(1000),
        description: 'hello'
      })

      expect(config.baseSupply).toEqual(BigInt(500))
      expect(config.maxSupply).toEqual(BigInt(1000))
      expect(config.description).toEqual('hello')
    })
  })

  describe('getters', function () {
    test('should expose the convention decimals', function () {
      const config = buildTokenConfiguration()

      expect(config.conventions.decimals).toEqual(8)
    })

    test('should default mainControlGroup to undefined', function () {
      const config = buildTokenConfiguration()

      expect(config.mainControlGroup).toBeUndefined()
    })
  })

  describe('setters', function () {
    test('should allow updating baseSupply', function () {
      const config = buildTokenConfiguration()

      config.baseSupply = BigInt(7)

      expect(config.baseSupply).toEqual(BigInt(7))
    })

    test('should allow updating maxSupply to a value and back to undefined', function () {
      const config = buildTokenConfiguration()

      config.maxSupply = BigInt(42)
      expect(config.maxSupply).toEqual(BigInt(42))

      config.maxSupply = undefined
      expect(config.maxSupply).toBeUndefined()
    })

    test('should allow updating description', function () {
      const config = buildTokenConfiguration()

      config.description = 'updated'

      expect(config.description).toEqual('updated')
    })

    test('should allow updating startAsPaused / isAllowedTransferToFrozenBalance', function () {
      const config = buildTokenConfiguration()

      config.startAsPaused = true
      config.isAllowedTransferToFrozenBalance = true

      expect(config.startAsPaused).toEqual(true)
      expect(config.isAllowedTransferToFrozenBalance).toEqual(true)
    })

    test('should allow updating mainControlGroup', function () {
      const config = buildTokenConfiguration()

      config.mainControlGroup = 3

      expect(config.mainControlGroup).toEqual(3)
    })

    test('should allow updating mainControlGroupCanBeModified', function () {
      const config = buildTokenConfiguration()

      config.mainControlGroupCanBeModified = AuthorizedActionTakersWASM.ContractOwner()

      expect(config.mainControlGroupCanBeModified).toBeDefined()
    })
  })

  describe('calculateTokenId', function () {
    test('should derive a deterministic token id from a contract id and position', function () {
      const contractId = new IdentifierWASM('HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')

      const tokenIdA = TokenConfigurationWASM.calculateTokenId(contractId, 0)
      const tokenIdB = TokenConfigurationWASM.calculateTokenId(contractId, 0)
      const tokenIdC = TokenConfigurationWASM.calculateTokenId(contractId, 1)

      expect(tokenIdA.base58()).toEqual(tokenIdB.base58())
      expect(tokenIdA.base58()).not.toEqual(tokenIdC.base58())
    })
  })
})