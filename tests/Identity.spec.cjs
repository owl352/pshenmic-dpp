const assert = require('assert')
const { IdentifierWASM, IdentityWASM, PlatformVersionWASM, IdentityPublicKeyWASM } = require('../')

let identifierBytes
let identifier

describe('Identity', function () {
  before(function () {
    identifierBytes = Uint8Array.from([9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19, 104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19])
    identifier = new IdentifierWASM(identifierBytes)
  })

  describe('serialization / deserialization', function () {
    it('should generate identity from identifier str', async function () {
      const identity = new IdentityWASM('HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')

      assert.equal(identity.id.base58(), 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr')
    })

    it('should generate identity from identifier bytes ', async function () {
      const identity = new IdentityWASM(identifierBytes)

      assert.equal(identity.id.base58(), identifier.base58())
    })

    it('should generate identity from identifier bytes with PlatformVersion', async function () {
      const identity = new IdentityWASM(identifierBytes, PlatformVersionWASM.PLATFORM_V10)

      assert.equal(identity.id.base58(), identifier.base58())
    })

    it('should generate identity from identifier and return bytes', async function () {
      const identity = new IdentityWASM(identifier)

      const newIdentity = IdentityWASM.fromBytes(identity.bytes())

      assert.equal(identity.id.base58(), newIdentity.id.base58())
    })
  })

  describe('getters', function () {
    it('should get id buffer', function () {
      const identity = new IdentityWASM(identifier)

      assert.deepEqual(identity.id.bytes(), identifierBytes)
    })

    it('should get balance', function () {
      const identity = new IdentityWASM(identifier)

      assert.deepEqual(identity.balance, BigInt(0))
    })

    it('should get revision', function () {
      const identity = new IdentityWASM(identifier)

      assert.deepEqual(identity.revision, BigInt(0))
    })

    it('should get public keys', function () {
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

      assert.equal(identity.getPublicKeys().length, 2)
    })
  })

  describe('setters', function () {
    it('should allows to set public key', function () {
      const pubKey = new IdentityPublicKeyWASM(
        0,
        0,
        0,
        0,
        false,
        '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')

      const identity = new IdentityWASM(identifier)

      identity.addPublicKey(pubKey)

      assert.deepEqual(identity.getPublicKeyById(0).bytes(), pubKey.bytes())
    })

    it('should allows to set balance', function () {
      const identity = new IdentityWASM(identifier)

      identity.balance = BigInt(21)

      assert.equal(identity.balance, BigInt(21))
    })

    it('should allows to set revision', function () {
      const identity = new IdentityWASM(identifier)

      identity.revision = BigInt(21)

      assert.equal(identity.revision, BigInt(21))
    })
  })
})
