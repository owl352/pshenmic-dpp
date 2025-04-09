const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { identifier, identityBytesWithoutKeys, identifierBytes, balance, revision } = require('./mocks/Identity')
const { keyId, purpose, securityLevel, keyType, binaryData } = require('./mocks/PublicKey')

let wasm

describe('Identity', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should generate identity from identifier', async function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.notEqual(identity.__wbg_ptr, 0)
    })

    it('should generate identity from identifier and return bytes', async function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.deepEqual(Array.from(identity.toBytes()), identityBytesWithoutKeys)

      const newIdentity = wasm.IdentityWASM.fromBytes(identity.toBytes())

      assert.notEqual(identity.__wbg_ptr, 0)
      assert.notEqual(newIdentity.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should get id buffer', function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.deepEqual(Array.from(identity.getId()), identifierBytes)
    })

    it('should get balance', function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.deepEqual(identity.getBalance(), BigInt(0))
    })

    it('should get revision', function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.deepEqual(identity.getRevision(), BigInt(0))
    })

    it('should get public keys', function () {
      const identity = new wasm.IdentityWASM(identifier)

      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const pubKey2 = new wasm.IdentityPublicKeyWASM(
        keyId + 1,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      identity.addPublicKey(pubKey)
      identity.addPublicKey(pubKey2)

      assert.equal(identity.getPublicKeys().length, 2)
    })
  })

  describe('setters', function () {
    it('should allows to set public key', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const identity = new wasm.IdentityWASM(identifier)

      identity.addPublicKey(pubKey)

      assert.notEqual(identity.__wbg_ptr, 0)

      assert.deepEqual(identity.getPublicKeyById(keyId).toBytes(), pubKey.toBytes())
    })

    it('should allows to set balance', function () {
      const identity = new wasm.IdentityWASM(identifier)

      identity.setBalance(balance)

      assert.equal(identity.getBalance(), balance)
    })

    it('should allows to set revision', function () {
      const identity = new wasm.IdentityWASM(identifier)

      identity.setRevision(revision)

      assert.equal(identity.getRevision(), revision)
    })
  })
})
