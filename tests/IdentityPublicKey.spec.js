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

      assert.equal(pubKey.getKeyId(), newPubKey.getKeyId())
      assert.equal(pubKey.getPurpose(), newPubKey.getPurpose())
      assert.equal(pubKey.getSecurityLevel(), newPubKey.getSecurityLevel())
      assert.equal(pubKey.getKeyType(), newPubKey.getKeyType())
      assert.equal(pubKey.getReadOnly(), newPubKey.getReadOnly())
      assert.equal(pubKey.getData(), newPubKey.getData())

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

      assert.equal(pubKey.getKeyId(), keyId)
      assert.equal(pubKey.getPurpose(), 'AUTHENTICATION')
      assert.equal(pubKey.getSecurityLevel(), 'CRITICAL')
      assert.equal(pubKey.getKeyType(), 'ECDSA_SECP256K1')
      assert.equal(pubKey.getReadOnly(), false)
      assert.equal(pubKey.getData(), binaryData)
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

      pubKey.setKeyId(keyIdSet)
      pubKey.setPurpose(purposeSet)
      pubKey.setSecurityLevel(securityLevelSet)
      pubKey.setKeyType(keyTypeSet)
      pubKey.setReadOnly(true)
      pubKey.setData(binaryDataSet)

      assert.equal(pubKey.getKeyId(), keyIdSet)
      assert.equal(pubKey.getPurpose(), 'ENCRYPTION')
      assert.equal(pubKey.getSecurityLevel(), 'HIGH')
      assert.equal(pubKey.getKeyType(), 'ECDSA_HASH160')
      assert.equal(pubKey.getReadOnly(), true)
      assert.equal(pubKey.getData(), binaryDataSet)
    })
  })
})
