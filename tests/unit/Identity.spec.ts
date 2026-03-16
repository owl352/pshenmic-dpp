import {IdentifierWASM, IdentityWASM, PlatformVersionWASM, IdentityPublicKeyWASM} from 'pshenmic-dpp'

let identifierBytes: Uint8Array
let identifier: IdentifierWASM

describe('Identity', function () {
  beforeAll(function () {
    identifierBytes = Uint8Array.from([9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19, 104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19])
    identifier = new IdentifierWASM(identifierBytes)
  })

  describe('serialization / deserialization', function () {
    test('should generate identity from identifier str', async function () {
      const identity = new IdentityWASM('HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')

      expect(identity).toBeInstanceOf(IdentityWASM)
      expect(identity.id.base58()).toEqual('HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')
    })

    test('should generate identity from identifier bytes ', async function () {
      const identity = new IdentityWASM(identifierBytes)

      expect(identity.id.base58()).toEqual(identifier.base58())
    })

    test('should generate identity from identifier bytes with PlatformVersion', async function () {
      const identity = new IdentityWASM(identifierBytes, PlatformVersionWASM.PLATFORM_V10)

      expect(identity.id.base58()).toEqual(identifier.base58())
    })

    test('should generate identity from identifier and return bytes', async function () {
      const identity = new IdentityWASM(identifier)

      const newIdentity = IdentityWASM.fromBytes(identity.bytes())

      expect(identity.id.base58()).toEqual(newIdentity.id.base58())
    })
  })

  describe('getters', function () {
    test('should get id buffer', function () {
      const identity = new IdentityWASM(identifier)

      expect(identity.id.bytes()).toEqual(identifierBytes)
    })

    test('should get balance', function () {
      const identity = new IdentityWASM(identifier)

      expect(identity.balance).toEqual(BigInt(0))
    })

    test('should get revision', function () {
      const identity = new IdentityWASM(identifier)

      expect(identity.revision).toEqual(BigInt(0))
    })

    test('should get public keys', function () {
      const identity = new IdentityWASM(identifier)

      const pubKey = new IdentityPublicKeyWASM(
        0,
        0,
        0,
        0,
        false,
        '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')

      const pubKey2 = new IdentityPublicKeyWASM(
        1,
        0,
        0,
        0,
        false,
        '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')

      identity.addPublicKey(pubKey)
      identity.addPublicKey(pubKey2)

      expect(identity.getPublicKeys().length).toEqual(2)
    })
  })

  describe('setters', function () {
    test('should allows to set public key', function () {
      const pubKey = new IdentityPublicKeyWASM(
        0,
        0,
        0,
        0,
        false,
        '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')

      const identity = new IdentityWASM(identifier)

      identity.addPublicKey(pubKey)

      expect(identity.getPublicKeyById(0)?.bytes()).toEqual(pubKey.bytes())
    })

    test('should allows to set balance', function () {
      const identity = new IdentityWASM(identifier)

      identity.balance = BigInt(21)

      expect(identity.balance).toEqual(BigInt(21))
    })

    test('should allows to set revision', function () {
      const identity = new IdentityWASM(identifier)

      identity.revision = BigInt(21)

      expect(identity.revision).toEqual(BigInt(21))
    })
  })
})
