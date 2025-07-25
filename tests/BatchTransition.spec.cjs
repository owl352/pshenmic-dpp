const assert = require('assert')
const { describe, it } = require('mocha')
const { document, documentTypeName, revision, dataContractId, ownerId, id } = require('./mocks/Document/index.js')
const { default: wasm } = require('..')

describe('BatchTransition', function () {
  describe('serialization / deserialization', function () {
    describe('documents', function () {
      it('should allow to create from v0 transition', function () {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

        const documentTransition = createTransition.toDocumentTransition()

        const batch = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batch.__wbg_ptr, 0)
      })

      it('should allow to create from v1 transition', function () {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

        const documentTransition = createTransition.toDocumentTransition()

        const batchedTransition = new wasm.BatchedTransitionWASM(documentTransition)

        const batch = wasm.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition, batchedTransition], documentInstance.ownerId, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchedTransition.__wbg_ptr, 0)
        assert.notEqual(batch.__wbg_ptr, 0)
      })
    })
    describe('tokens', function () {
      it('should allow to create from v1 transition', function () {
        const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

        const mintTransition = new wasm.TokenMintTransitionWASM(baseTransition, ownerId, BigInt(9999), 'bbbbbb')

        const transition = new wasm.TokenTransitionWASM(mintTransition)

        const batchedTransition = new wasm.BatchedTransitionWASM(transition)

        const batch = wasm.BatchTransitionWASM.fromV1BatchedTransitions([batchedTransition, batchedTransition], ownerId, 1)

        assert.notEqual(baseTransition.__wbg_ptr, 0)
        assert.notEqual(mintTransition.__wbg_ptr, 0)
        assert.notEqual(transition.__wbg_ptr, 0)
        assert.notEqual(batchedTransition.__wbg_ptr, 0)
        assert.notEqual(batch.__wbg_ptr, 0)
      })
    })
  })

  describe('getters', function () {
    it('should allow to get transitions', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.equal(batchTransition.transitions.length, 2)
    })

    it('should allow to get signature', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.deepEqual(batchTransition.signature, new Uint8Array(0))
    })

    it('should allow to get signature public key id', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.equal(batchTransition.signaturePublicKeyId, 1)
    })

    it('should allow to get all purchases amount', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))
      const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

      const documentTransition = createTransition.toDocumentTransition()
      const documentTransition2 = purchaseTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition2], documentInstance.ownerId, 1, 1)

      assert.deepEqual(batchTransition.allPurchasesAmount, BigInt(100))
    })

    it('should allow to get owner id', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.deepEqual(batchTransition.ownerId.base58(), documentInstance.ownerId.base58())
    })

    it('should allow to get modified data ids', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.deepEqual(batchTransition.modifiedDataIds.map(id => id.base58()), [documentTransition.id.base58(), documentTransition.id.base58()])
    })

    it('should allow to get allConflictingIndexCollateralVotingFunds', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

      assert.deepEqual(batchTransition.allConflictingIndexCollateralVotingFunds, undefined)
    })
  })
})
