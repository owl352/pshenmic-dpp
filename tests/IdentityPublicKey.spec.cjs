const assert = require('assert')
const { describe, it } = require('mocha')
const {
  keyId, purpose, securityLevel, keyType, binaryData, securityLevelSet, keyIdSet, purposeSet,
  keyTypeSet, binaryDataSet
} = require('./mocks/PublicKey')
const { wif } = require('./mocks/PrivateKey')
const { toHexString } = require('./utils/hex')
const { default: wasm } = require('..')

describe('PublicKey', function () {
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

      const bytes = pubKey.bytes()

      const newPubKey = wasm.IdentityPublicKeyWASM.fromBytes(Array.from(bytes))

      assert.notEqual(pubKey.__wbg_ptr, 0)
      assert.notEqual(newPubKey.__wbg_ptr, 0)

      assert.equal(pubKey.keyId, newPubKey.keyId)
      assert.equal(pubKey.purpose, newPubKey.purpose)
      assert.equal(pubKey.securityLevel, newPubKey.securityLevel)
      assert.equal(pubKey.keyType, newPubKey.keyType)
      assert.equal(pubKey.readOnly, newPubKey.readOnly)
      assert.equal(pubKey.data, newPubKey.data)

      assert.deepEqual(pubKey.bytes(), newPubKey.bytes())

      assert.notEqual(pubKey.__wbg_ptr, 0)
      assert.notEqual(newPubKey.__wbg_ptr, 0)
    })

    it('should return hash of key', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const hash = pubKey.getPublicKeyHash()

      assert.deepEqual(hash, toHexString([211, 114, 240, 150, 37, 159, 114, 104, 110, 24, 102, 61, 125, 181, 248, 98, 52, 221, 111, 85]))
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

      assert.equal(pubKey.keyId, keyId)
      assert.equal(pubKey.purpose, 'AUTHENTICATION')
      assert.equal(pubKey.securityLevel, 'CRITICAL')
      assert.equal(pubKey.keyType, 'ECDSA_SECP256K1')
      assert.equal(pubKey.readOnly, false)
      assert.equal(pubKey.data, binaryData)
    })

    it('should allow to validate private key', function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const privateKey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pubKey.validatePrivateKey(privateKey.bytes(), wasm.NetworkWASM.Mainnet), false)
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

      pubKey.keyId = keyIdSet
      pubKey.purpose = purposeSet
      pubKey.securityLevel = securityLevelSet
      pubKey.keyType = keyTypeSet
      pubKey.readOnly = true
      pubKey.data = binaryDataSet

      assert.equal(pubKey.keyId, keyIdSet)
      assert.equal(pubKey.purpose, 'ENCRYPTION')
      assert.equal(pubKey.securityLevel, 'HIGH')
      assert.equal(pubKey.keyType, 'ECDSA_HASH160')
      assert.equal(pubKey.readOnly, true)
      assert.equal(pubKey.data, binaryDataSet)
    })
  })
})
