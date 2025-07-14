const assert = require('assert')
const { describe, it } = require('mocha')
const { wif, bytes, publicKeyHash } = require('./mocks/PrivateKey')
const { fromHexString, toHexString } = require('./utils/hex')
const { default: wasm } = require('..')

describe('PrivateKey', function () {
  describe('serialization / deserialization', function () {
    it('should allows to create PrivateKey from wif', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.notEqual(pkey.__wbg_ptr, 0)
    })

    it('should allows to create PrivateKey from bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromBytes(fromHexString(bytes), 'Mainnet')

      assert.notEqual(pkey.__wbg_ptr, 0)
    })

    it('should allows to create PrivateKey from hex', function () {
      const pkey = wasm.PrivateKeyWASM.fromBytes(fromHexString(bytes), 'Mainnet')

      const pkeyFromHex = wasm.PrivateKeyWASM.fromHex(bytes, 'Mainnet')

      assert.deepEqual(pkey.bytes(), pkeyFromHex.bytes())
    })

    it('should allow to create PrivateKey from wif and read value in wif', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.WIF(), wif)
    })

    it('should allow to create PrivateKey from wif and write value in bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.deepEqual(pkey.bytes(), fromHexString(bytes))
    })
  })

  describe('getters', function () {
    it('should allow to get key wif', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.WIF(), wif)
    })

    it('should allow to get key bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(toHexString(pkey.bytes()), bytes)
    })

    it('should allow to get key hex', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.hex().toLowerCase(), bytes)
    })

    it('should allow to get public key hash', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.deepEqual(pkey.getPublicKeyHash(), publicKeyHash)
    })
  })
})
