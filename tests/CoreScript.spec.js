const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('CoreScript', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from bytes', () => {
      const script = wasm.CoreScriptWASM.fromBytes(Buffer.from('76a914c3dbfd40e7f8a4845c2f8e868a167c984049764988ac', 'hex'))

      assert.notEqual(script._wbg_ptr, 0)
    })

    it('should allow to create P2PKH', () => {
      const script = wasm.CoreScriptWASM.newP2PKH([195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73])

      assert.notEqual(script._wbg_ptr, 0)
    })

    it('should allow to create P2SH', () => {
      const script = wasm.CoreScriptWASM.newP2SH([195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73])

      assert.notEqual(script._wbg_ptr, 0)
    })

    it('should allow to convert to asm P2PKH', () => {
      const script = wasm.CoreScriptWASM.newP2PKH([195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73])

      assert.equal(script.toASMString(), 'OP_DUP OP_HASH160 OP_PUSHBYTES_20 c3dbfd40e7f8a4845c2f8e868a167c9840497649 OP_EQUALVERIFY OP_CHECKSIG')
    })
  })
})
