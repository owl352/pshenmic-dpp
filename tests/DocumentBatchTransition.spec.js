const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { document, documentTypeName, revision, dataContractId, ownerId, id } = require('./mocks/Document')

let wasm

describe('DocumentsBatch', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from document_transitions', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1)

      assert.notEqual(documentInstance.__wbg_ptr, 0)
      assert.notEqual(createTransition.__wbg_ptr, 0)
      assert.notEqual(documentTransition.__wbg_ptr, 0)
      assert.notEqual(batchTransition.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get document_transitions', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.equal(batchTransition.transitions.length, 2)
    })

    it('should allow to get signature', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.deepEqual(batchTransition.signature, new Uint8Array(0))
    })

    it('should allow to get signature public key id', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.equal(batchTransition.signaturePublicKeyId, 1)
    })

    it('should allow to get all purchases amount', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')
      const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

      const documentTransition = createTransition.toDocumentTransition()
      const documentTransition2 = purchaseTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition2], documentInstance.getOwnerId(), 1, 1)

      assert.deepEqual(batchTransition.allPurchasesAmount, BigInt(100))
    })

    it('should allow to get owner id', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.deepEqual(batchTransition.ownerId.base58(), documentInstance.getOwnerId().base58())
    })

    it('should allow to get modified data ids', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.deepEqual(batchTransition.modifiedDataIds.map(id => id.base58()), [documentTransition.id.base58(), documentTransition.id.base58()])
    })

    it('should allow to get allConflictingIndexCollateralVotingFunds', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
      const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

      const documentTransition = createTransition.toDocumentTransition()

      const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

      assert.deepEqual(batchTransition.allConflictingIndexCollateralVotingFunds, undefined)
    })
  })
})
