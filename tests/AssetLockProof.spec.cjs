const assert = require('assert')
const { describe, it } = require('mocha')
const { instantLockBytes, transactionBytes } = require('./mocks/Locks')
const { default: wasm } = require('..')

describe('AssetLockProof', function () {
  describe('serialization / deserialization', function () {
    it('should allow to get instant lock proof via constructor', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)
      const instantLockProof = new wasm.InstantAssetLockProofWASM(instantLockBytes, transactionBytes, 0)

      const instantAssetLock = new wasm.AssetLockProofWASM(instantLockProof)
      const chainAssetLock = new wasm.AssetLockProofWASM(chainlock)

      assert.equal(instantAssetLock.constructor.name, 'AssetLockProofWASM')
      assert.notEqual(instantAssetLock.__wbg_ptr, 0)
      assert.equal(chainAssetLock.constructor.name, 'AssetLockProofWASM')
      assert.notEqual(chainAssetLock.__wbg_ptr, 0)
    })

    it('shouldn\'t allow to get chain lock proof via constructor', () => {
      try {
        // eslint-disable-next-line
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

    it('should allow to serialize and deserialize asset lock in hex', () => {
      const instantLockProof = wasm.AssetLockProofWASM.createInstantAssetLockProof(instantLockBytes, transactionBytes, 0)

      const newInstantLockProof = wasm.AssetLockProofWASM.fromHex(instantLockProof.hex())

      assert.equal(instantLockProof.constructor.name, 'AssetLockProofWASM')
      assert.equal(newInstantLockProof.constructor.name, 'AssetLockProofWASM')

      assert.deepEqual(newInstantLockProof.toObject(), instantLockProof.toObject())
    })
  })

  describe('getters', function () {
    it('should allow to get lock type', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const instantLockProof = new wasm.InstantAssetLockProofWASM(instantLockBytes, transactionBytes, 0)

      const instantAssetLockProof = new wasm.AssetLockProofWASM(instantLockProof)
      const chainLockProof = wasm.AssetLockProofWASM.createChainAssetLockProof(1, outpoint)

      assert.equal(instantAssetLockProof.getLockType(), 'Instant')
      assert.equal(chainLockProof.getLockType(), 'Chain')
    })

    it('should allow to get lock instances', () => {
      const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)
      const instantLockProof = new wasm.InstantAssetLockProofWASM(instantLockBytes, transactionBytes, 0)

      const chainLockProof = wasm.AssetLockProofWASM.createChainAssetLockProof(1, outpoint)
      const instantAssetLockProof = new wasm.AssetLockProofWASM(instantLockProof)

      assert.equal(chainLockProof.getChainLockProof().constructor.name, 'ChainAssetLockProofWASM')
      assert.equal(instantAssetLockProof.getInstantLockProof().constructor.name, 'InstantAssetLockProofWASM')
    })

    it('should allow to return object of lock', () => {
      const instantLockProof = new wasm.InstantAssetLockProofWASM(instantLockBytes, transactionBytes, 0)

      const instantAssetLockProof = new wasm.AssetLockProofWASM(instantLockProof)

      const expected = {
        instantLock: instantLockBytes,
        transaction: transactionBytes,
        outputIndex: 0
      }

      assert.deepEqual(instantLockProof.toObject(), expected)
    })
  })
})
