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
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.notEqual(pkey.__wbg_ptr, 0)
    })

    it('should allows to create PrivateKey from bytes', function () {
      const pkey = wasm.PrivateKeyWASM.fromBytes(fromHexString(bytes))

      assert.notEqual(pkey.__wbg_ptr, 0)
    })

    it('should allow to create PrivateKey from wif and read value in wif', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.equal(pkey.getKeyWIF(), wif)
    })

    it('should allow to create PrivateKey from wif and write value in bytes', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.deepEqual(pkey.getKeyBytes(), fromHexString(bytes))
    })
  })

  describe('getters', function () {
    it('should allow to get key wif', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.equal(pkey.getKeyWIF(), wif)
    })

    it('should allow to get key bytes', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.equal(toHexString(pkey.getKeyBytes()), bytes)
    })

    it('should allow to get public key hash', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.deepEqual(pkey.getPublicKeyHash(), publicKeyHash)
    })
  })
})
