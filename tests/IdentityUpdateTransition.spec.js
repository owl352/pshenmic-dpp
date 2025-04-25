const assert = require('assert')
const {describe, it, before} = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('IdentityUpdateTransition', function () {
  before(async function () {
    wasm = initWasm()
  })

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

  })
})
