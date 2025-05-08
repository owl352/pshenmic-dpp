const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('OutPoint', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      assert.notEqual(outpoint.__wbg_ptr, 0)
    })

    it('should allow to create from bytes', () => {
      const txIdBytes = Buffer.from('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 'hex')

      // 32 bytes for txId and 4 bytes for vout
      const bytes = [...txIdBytes.reverse(), ...[0, 0, 0, 1].reverse()]

      const outpoint = wasm.OutPointWASM.fromBytes(bytes)

      assert.notEqual(outpoint.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get txid', function () {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      assert.equal(outpoint.getTXID(), 'e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d')
    })

    it('should allow to get VOUT', function () {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      assert.equal(outpoint.getVOUT(), 1)
    })

    it('should allow to get bytes', function () {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      const txIdBytes = Buffer.from('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 'hex')

      // 32 bytes for txId and 4 bytes for vout
      const bytes = [...txIdBytes.reverse(), ...[0, 0, 0, 1].reverse()]

      assert.deepEqual(outpoint.toBytes(), Uint8Array.from(bytes))
    })
  })
})
