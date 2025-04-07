const assert = require('assert')
const {describe, it, before} = require('mocha')
const initWasm = require('./utils/wasm')
const {value} = require("./mocks/DataContract");
const {document, documentTypeName, revision, dataContractId, ownerId, id} = require("./mocks/Document");

let wasm

describe('DocumentsTransitions', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    describe('document Create transition', function () {
      it("should allow to create CreateTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from Create transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getCreateTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })

    describe('document Delete transition', function () {
      it("should allow to create DeleteTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from Delete transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getDeleteTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })

    describe('document Replace transition', function () {
      it("should allow to create ReplaceTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from Replace transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getReplaceTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })

    describe('document Transfer transition', function () {
      it("should allow to create ReplaceTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', Array.from(documentInstance.getOwnerId()))

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from Replace transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', Array.from(documentInstance.getOwnerId()))

        const documentTransition = transferTransition.toDocumentTransition()

        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', Array.from(documentInstance.getOwnerId()))

        const documentTransition = transferTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', Array.from(documentInstance.getOwnerId()))

        const documentTransition = transferTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getTransferTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })

    describe('document UpdatePrice transition', function () {
      it("should allow to create UpdatePriceTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from UpdatePrice transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getUpdatePriceTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })

    describe('document Purchase transition', function () {
      it("should allow to create PurchaseTransition from document", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Transition from PurchaseTransition transition", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it("should allow to create Document Batch Transition from Document Transitions", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it("should allow to create state transitions from document and convert state transition to document batch", () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1, 1,)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.DocumentsBatchWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.getTransitions()

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].getPurchaseTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
        assert.notEqual(st.__wbg_ptr, 0)
        assert.notEqual(deserializedBatch.__wbg_ptr, 0)
        assert.notEqual(deserializedPurchaseTransition.__wbg_ptr, 0)
      })
    })
  })
})
