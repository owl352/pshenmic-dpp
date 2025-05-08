const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('TxOut', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from values with pubkey hex', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')
      assert.notEqual(out.__wbg_ptr, 0)
    })

    it('should allow to create from values with pubkey array', function () {
      const out = new wasm.TxOutWASM(BigInt(100), Array.from(Buffer.from('76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac', 'hex')))

      assert.notEqual(out.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get value', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      assert.equal(out.value, BigInt(100))
    })

    it('should allow to get script hex', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      assert.equal(out.scriptPubKeyHex, '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')
    })

    it('should allow to get script bytes', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      assert.deepEqual(out.scriptPubKeyBytes, Uint8Array.from(Buffer.from('76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac', 'hex')))
    })

    it('should allow to get script asm', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      assert.deepEqual(out.getScriptPubKeyASM(), 'OP_DUP OP_HASH160 OP_PUSHBYTES_20 1a486a3855e6dc6dd02874424f53a6f2197b3d45 OP_EQUALVERIFY OP_CHECKSIG')
    })
  })

  describe('setters', function () {
    it('should allow to set value', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      out.value = BigInt(101)

      assert.equal(out.value, BigInt(101))
    })

    it('should allow to set script hex', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      out.scriptPubKeyHex = '16a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac'

      assert.equal(out.scriptPubKeyHex, '16a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')
    })

    it('should allow to set script bytes', function () {
      const out = new wasm.TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

      out.scriptPubKeyBytes = Array.from(Buffer.from('76a914f995e42d1aa7a31b0106b63e1b896fe9aeeccc9988ac', 'hex'))

      assert.deepEqual(out.scriptPubKeyBytes, Uint8Array.from(Buffer.from('76a914f995e42d1aa7a31b0106b63e1b896fe9aeeccc9988ac', 'hex')))
    })
  })
})
