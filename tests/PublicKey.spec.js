const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const {
  keyId, purpose, securityLevel, keyType, binaryData, securityLevelSet, keyIdSet, purposeSet,
  keyTypeSet, binaryDataSet
} = require('./mocks/PublicKey')

let wasm

describe('PublicKey', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should generate public key from values with type ECDSA_SECP256K1', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      assert.notEqual(pubKey.__wbg_ptr, 0)
    })

    it('should generate public key from values with type ECDSA_SECP256K1 and generate new from self bytes', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const bytes = pubKey.toBytes()

      const newPubKey = wasm.IdentityPublicKeyWASM.fromBytes(Array.from(bytes))

      assert.notEqual(pubKey.__wbg_ptr, 0)
      assert.notEqual(newPubKey.__wbg_ptr, 0)

      assert.equal(pubKey.getKeyId(), newPubKey.getKeyId())
      assert.equal(pubKey.getPurpose(), newPubKey.getPurpose())
      assert.equal(pubKey.getSecurityLevel(), newPubKey.getSecurityLevel())
      assert.equal(pubKey.getKeyType(), newPubKey.getKeyType())
      assert.equal(pubKey.getReadOnly(), newPubKey.getReadOnly())
      assert.equal(pubKey.getData(), newPubKey.getData())

      assert.deepEqual(pubKey.toBytes(), newPubKey.toBytes())

      assert.notEqual(pubKey.__wbg_ptr, 0)
      assert.notEqual(newPubKey.__wbg_ptr, 0)
    })
  })
  describe('getters', function () {
    it('should generate public key from values with type ECDSA_SECP256K1 and return all fields', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      assert.equal(pubKey.getKeyId(), keyId)
      assert.equal(pubKey.getPurpose(), purpose)
      assert.equal(pubKey.getSecurityLevel(), securityLevel)
      assert.equal(pubKey.getKeyType(), keyType)
      assert.equal(pubKey.getReadOnly(), false)
      assert.equal(pubKey.getData(), binaryData)
    })
  })

  describe('setters', function () {
    it('should generate public key from values with type ECDSA_SECP256K1 and return all fields and set another fields', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      pubKey.setKeyId(keyIdSet)
      pubKey.setPurpose(purposeSet)
      pubKey.setSecurityLevel(securityLevelSet)
      pubKey.setKeyType(keyTypeSet)
      pubKey.setReadOnly(true)
      pubKey.setData(binaryDataSet)

      assert.equal(pubKey.getKeyId(), keyIdSet)
      assert.equal(pubKey.getPurpose(), purposeSet)
      assert.equal(pubKey.getSecurityLevel(), securityLevelSet)
      assert.equal(pubKey.getKeyType(), keyTypeSet)
      assert.equal(pubKey.getReadOnly(), true)
      assert.equal(pubKey.getData(), binaryDataSet)
    })
  })
})
