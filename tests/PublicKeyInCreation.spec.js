const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('InstantLock', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.notEqual(publicKeyInCreation.__wbg_ptr, 0)
    })

    it('should allow to create from values and convert to identity public key', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      const publicKey = publicKeyInCreation.toIdentityPublicKey()

      assert.notEqual(publicKeyInCreation.__wbg_ptr, 0)
      assert.equal(publicKey.constructor.name, 'IdentityPublicKeyWASM')
    })
  })

  describe('getters', function () {
    it('should allow to get key id', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.equal(publicKeyInCreation.keyId, 0)
    })

    it('should allow to get purpose', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.equal(publicKeyInCreation.purpose, 'AUTHENTICATION')
    })

    it('should allow to get security level', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.equal(publicKeyInCreation.securityLevel, 'MASTER')
    })

    it('should allow to get key type', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.equal(publicKeyInCreation.keyType, 'ECDSA_SECP256K1')
    })

    it('should allow to get read only', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.equal(publicKeyInCreation.readOnly, false)
    })

    it('should allow to get data', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.deepEqual(Buffer.from(publicKeyInCreation.data), Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'))
    })

    it('should allow to get signature', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      assert.deepEqual([...publicKeyInCreation.signature], [])
    })
  })

  describe('setters', function () {
    it('should allow to set key id', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.keyId = 123

      assert.equal(publicKeyInCreation.keyId, 123)
    })

    it('should allow to set purpose', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.purpose = 'OWNER'

      assert.equal(publicKeyInCreation.purpose, 'OWNER')
    })

    it('should allow to set security level', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.securityLevel = 'critical'

      assert.equal(publicKeyInCreation.securityLevel, 'CRITICAL')
    })

    it('should allow to set key type', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.keyType = 'ECDSA_HASH160'

      assert.equal(publicKeyInCreation.keyType, 'ECDSA_HASH160')
    })

    it('should allow to set read only', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.readOnly = true

      assert.equal(publicKeyInCreation.readOnly, true)
    })

    it('should allow to set data', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.data = Buffer.from('333333333334001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex')

      assert.deepEqual(Buffer.from(publicKeyInCreation.data), Buffer.from('333333333334001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'))
    })

    it('should allow to set signature', () => {
      const publicKeyInCreation = new wasm.IdentityPublicKeyInCreationWASM(
        0,
        'AUTHENTICATION',
        'master',
        'ECDSA_SECP256K1',
        false,
        Buffer.from('0333d5cf3674001d2f64c55617b7b11a2e8fc62aab09708b49355e30c7205bdb2e', 'hex'),
        []
      )

      publicKeyInCreation.signature = [1, 2, 3, 4, 5, 6]

      assert.deepEqual([...publicKeyInCreation.signature], [1, 2, 3, 4, 5, 6])
    })
  })
})
