const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('InstantLock', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create chain lock proof from values', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)

      assert.notEqual(chainlock.__wbg_ptr, 0)
    })

    it('should allow to create chain lock proof from object', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = wasm.ChainAssetLockProofWASM.fromRawObject({
        coreChainLockedHeight: 11,
        outPoint: Array.from(outpoint.bytes())
      })

      assert.notEqual(chainlock.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get coreChainLockedHeight', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)

      assert.equal(chainlock.coreChainLockedHeight, 11)
    })

    it('should allow to get outPoint', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)

      assert.equal(chainlock.outPoint.constructor.name, 'OutPointWASM')
    })
  })

  describe('setters', function () {
    it('should allow to set coreChainLockedHeight', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)

      chainlock.coreChainLockedHeight = 33

      assert.equal(chainlock.coreChainLockedHeight, 33)
    })

    it('should allow to get outPoint', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)

      const newOutpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 222)

      chainlock.outPoint = newOutpoint

      assert.equal(chainlock.outPoint.getVOUT(), 222)
      assert.notEqual(newOutpoint.__wbg_ptr, 0)
    })
  })
})
