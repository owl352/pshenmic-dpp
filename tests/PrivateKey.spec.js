const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { wif, bytes } = require('./mocks/PrivateKey')
const { fromHexString } = require('./utils/hex')

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

    it('should allow to create PrivateKey from wif and read value in wif', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.equal(pkey.getKeyWIF(), wif)
    })

    it('should allow to create PrivateKey from wif and write value in bytes', function () {
      const pkey = new wasm.PrivateKeyWASM(wif)

      assert.deepEqual(pkey.getKeyBytes(), fromHexString(bytes))
    })
  })
})
