const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { instantLockBytes, transactionBytes } = require('./mocks/Locks')

let wasm

describe('AssetLockProof', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to get instant lock proof via constructor', () => {
      const instantLockProof = new wasm.AssetLockProofWASM('instant')

      assert.equal(instantLockProof.constructor.name, 'AssetLockProofWASM')
    })

    it('shouldn\'t allow to get chain lock proof via constructor', () => {
      try {
        new wasm.AssetLockProofWASM('chain')
      } catch (e) {
        assert.ok(true)
        return
      }
      assert.ok()
    })

    it('should allow to create instant lock proof from values', () => {
      const instantLockProof = wasm.AssetLockProofWASM.createInstantAssetLockProof(instantLockBytes, transactionBytes, 0)

      assert.equal(instantLockProof.constructor.name, 'AssetLockProofWASM')
    })

    it('should allow to create chain lock proof from values', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      const chainLockProof = wasm.AssetLockProofWASM.createChainAssetLockProof(1, outpoint)

      assert.equal(chainLockProof.constructor.name, 'AssetLockProofWASM')
    })
  })

  describe('getters', function () {
    it('should allow to get lock type', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      const chainLockProof = wasm.AssetLockProofWASM.createChainAssetLockProof(1, outpoint)

      const instantLockProof = new wasm.AssetLockProofWASM('instant')

      assert.equal(chainLockProof.getLockType(), 'Chain')
      assert.equal(instantLockProof.getLockType(), 'Instant')
    })

    it('should allow to get lock instances', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

      const chainLockProof = wasm.AssetLockProofWASM.createChainAssetLockProof(1, outpoint)

      const instantLockProof = new wasm.AssetLockProofWASM('instant')

      assert.equal(chainLockProof.getChainLockProof().constructor.name, 'ChainAssetLockProofWASM')
      assert.equal(instantLockProof.getInstantLockProof().constructor.name, 'InstantAssetLockProofWASM')
    })

    it('should allow to return object of lock', () => {
      const instantLockProof = new wasm.AssetLockProofWASM('instant')

      const expected = {
        instantLock: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        transaction: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 255, 255, 255, 255, 1, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0],
        outputIndex: 0
      }

      assert.deepEqual(instantLockProof.toObject(), expected)
    })
  })
})
