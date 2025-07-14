const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('IdentityUpdateTransition', function () {
  describe('serialization / deserialization', function () {
    it('Should create IdentityUpdateTransition', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

      assert.notEqual(transition.__wbg_ptr, 0)
    })

    it('Should create IdentityUpdateTransition with key', function () {
      const key = new wasm.IdentityPublicKeyInCreationWASM(
        1, 'system', 'master', 'ECDSA_SECP256K1', false, [], []
      )

      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [key], [])

      assert.notEqual(transition.__wbg_ptr, 0)
      assert.notEqual(key.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('Should return revision', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

      assert.deepEqual(transition.revision, BigInt(1))
    })

    it('Should return nonce', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

      assert.deepEqual(transition.nonce, BigInt(1))
    })

    it('Should return identityIdentifier', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

      assert.deepEqual(transition.identityIdentifier.base58(), 'GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3')
    })

    it('Should return publicKeyIdsToDisable', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      assert.deepEqual(Array.from(transition.publicKeyIdsToDisable), [11])
    })

    it('Should return publicKeyIdsToAdd', function () {
      const key = new wasm.IdentityPublicKeyInCreationWASM(
        1, 'system', 'master', 'ECDSA_SECP256K1', false, [], []
      )

      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [key], [11])

      assert.deepEqual(transition.publicKeyIdsToAdd.length, 1)
    })

    it('Should return userFeeIncrease', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      assert.deepEqual(transition.userFeeIncrease, 1)
    })

    it('Should return signature', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      assert.deepEqual(transition.signature, Uint8Array.from([]))
    })

    it('Should return signature public key id', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      assert.deepEqual(transition.signaturePublicKeyId, 0)
    })
  })

  describe('setters', function () {
    it('Should allow to set identityIdentifier', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.identityIdentifier = '11Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3'

      assert.deepEqual(transition.identityIdentifier.base58(), '11Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3')
    })

    it('Should allow to set revision', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.revision = BigInt(11111)

      assert.deepEqual(transition.revision, BigInt(11111))
    })

    it('Should allow to set nonce', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.nonce = BigInt(11111)

      assert.deepEqual(transition.nonce, BigInt(11111))
    })

    it('Should allow to set publicKeyIdsToDisable', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.publicKeyIdsToDisable = [1, 2, 3, 4]

      assert.deepEqual(transition.publicKeyIdsToDisable, Uint32Array.from([1, 2, 3, 4]))
    })

    it('Should allow to set publicKeyIdsToAdd', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      const key = new wasm.IdentityPublicKeyInCreationWASM(
        1, 'system', 'master', 'ECDSA_SECP256K1', false, [], []
      )

      transition.publicKeyIdsToAdd = [key, key]

      assert.deepEqual(transition.publicKeyIdsToAdd.length, 2)
      assert.notEqual(key.__wbg_ptr, 0)
    })

    it('Should allow to set signature', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.signature = [0, 1, 2, 3, 5]

      assert.deepEqual(transition.signature, Uint8Array.from([0, 1, 2, 3, 5]))
    })

    it('Should allow to set signature public key id', function () {
      const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [11])

      transition.signaturePublicKeyId = 11

      assert.deepEqual(transition.signaturePublicKeyId, 11)
    })
  })
})
