const assert = require('assert')
const { describe, it, before } = require('mocha')
const { default: wasm } = require('..')

let identifierBytes

describe('Identifier', function () {
  before(async function () {
    identifierBytes = Uint8Array.from([9, 40, 40, 237, 192, 129, 211, 186, 26, 84, 240, 67, 37, 155, 148, 19, 104, 242, 199, 24, 136, 27, 6, 169, 211, 71, 136, 59, 33, 191, 227, 19])
  })

  describe('serialization / deserialization', function () {
    it('should allows to create Identifier from base58', function () {
      const identifier = wasm.IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from base64', function () {
      const identifier = wasm.IdentifierWASM.fromBase64('CSgo7cCB07oaVPBDJZuUE2jyxxiIGwap00eIOyG/4xM=')

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from hex', function () {
      const identifier = wasm.IdentifierWASM.fromHex('092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313')

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from bytes', function () {
      const identifier = wasm.IdentifierWASM.fromBytes(identifierBytes)

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from Identifier', function () {
      const identifier = wasm.IdentifierWASM.fromBytes(identifierBytes)
      const identifier2 = new wasm.IdentifierWASM(identifier)

      assert.deepEqual(identifier2.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from bytes in constructor', function () {
      const identifier = new wasm.IdentifierWASM(identifierBytes)

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })

    it('should allows to create Identifier from base58 in constructor', function () {
      const identifier = new wasm.IdentifierWASM('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })
  })

  describe('getters', function () {
    it('should allow to get identifier base58', function () {
      const identifier = wasm.IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.equal(identifier.base58(), 'ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')
    })

    it('should allow to get identifier base64', function () {
      const identifier = wasm.IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.equal(identifier.base64(), 'CSgo7cCB07oaVPBDJZuUE2jyxxiIGwap00eIOyG/4xM=')
    })

    it('should allow to get identifier hex', function () {
      const identifier = wasm.IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.equal(identifier.hex(), '092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313')
    })

    it('should allow to get identifier bytes', function () {
      const identifier = wasm.IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

      assert.deepEqual(identifier.bytes(), identifierBytes)
    })
  })
})
