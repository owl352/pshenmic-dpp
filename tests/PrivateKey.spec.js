const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { wif, bytes, publicKeyHash } = require('./mocks/PrivateKey')
const { fromHexString, toHexString } = require('./utils/hex')

let wasm

describe('PrivateKey', function () {
  before(async function () {
    wasm = initWasm()
  })

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

      assert.deepEqual(pkey.getBytes(), pkeyFromHex.getBytes())
    })

    it('should allow to create PrivateKey from wif and read value in wif', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.getWIF(), wif)
    })

    it('should allow to create PrivateKey from wif and write value in bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.deepEqual(pkey.getBytes(), fromHexString(bytes))
    })
  })

  describe('getters', function () {
    it('should allow to get key wif', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.getWIF(), wif)
    })

    it('should allow to get key bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(toHexString(pkey.getBytes()), bytes)
    })

    it('should allow to get key hex', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.equal(pkey.getHex().toLowerCase(), bytes)
    })

    it('should allow to get public key hash', function () {
      const pkey = wasm.PrivateKeyWASM.fromWIF(wif)

      assert.deepEqual(pkey.getPublicKeyHash(), publicKeyHash)
    })
  })
})
