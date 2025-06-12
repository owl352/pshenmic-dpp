const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { document, documentTypeName, revision, dataContractId, ownerId, id } = require('./mocks/Document')

let wasm

describe('DocumentsTransitions', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    describe('document Create transition', function () {
      it('should allow to create CreateTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from Create transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(createTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = createTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().createTransition

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
      it('should allow to create DeleteTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from Delete transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(deleteTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = deleteTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().deleteTransition

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
      it('should allow to create ReplaceTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from Replace transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(replaceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const documentTransition = replaceTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().replaceTransition

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
      it('should allow to create ReplaceTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from Replace transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        const documentTransition = transferTransition.toDocumentTransition()

        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        const documentTransition = transferTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(transferTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        const documentTransition = transferTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().transferTransition

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
      it('should allow to create UpdatePriceTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from UpdatePrice transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = updatePriceTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().updatePriceTransition

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
      it('should allow to create PurchaseTransition from document', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Transition from PurchaseTransition transition', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
      })

      it('should allow to create Document Batch Transition from Document Transitions', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
        assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        assert.notEqual(documentTransition.__wbg_ptr, 0)
        assert.notEqual(batchTransition.__wbg_ptr, 0)
      })

      it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const documentTransition = purchaseTransition.toDocumentTransition()

        const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.getOwnerId(), 1, 1)

        const st = batchTransition.toStateTransition()

        const deserializedBatch = wasm.BatchTransitionWASM.fromStateTransition(st)

        const deserializedTransitions = deserializedBatch.transitions

        assert.equal(deserializedTransitions.length, 2)

        const deserializedPurchaseTransition = deserializedTransitions[0].toTransition().purchaseTransition

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
  describe('getters', function () {
    describe('document Create transition', function () {
      it('get data', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.deepEqual(createTransition.data, document)
      })

      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.equal(createTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })

      it('get entropy', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.deepEqual(createTransition.entropy, documentInstance.getEntropy())
      })

      it('get prefunded voting balance', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.equal(createTransition.prefundedVotingBalance, undefined)
      })
    })

    describe('document Delete transition', function () {
      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.equal(deleteTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })
    })

    describe('document Replace transition', function () {
      it('get data', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.deepEqual(replaceTransition.data, document)
      })

      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.equal(replaceTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })

      it('get revision', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        assert.equal(replaceTransition.revision, BigInt(1))
      })
    })

    describe('document Transfer transition', function () {
      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        assert.equal(transferTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })

      it('get recipient', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        assert.deepEqual(transferTransition.recipientId.base58(), documentInstance.getOwnerId().base58())
      })
    })

    describe('document Update Price transition', function () {
      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.equal(updatePriceTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })

      it('get price', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.deepEqual(updatePriceTransition.price, BigInt(100))
      })
    })

    describe('document Purchase transition', function () {
      it('get base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.equal(purchaseTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
      })

      it('get price', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        assert.deepEqual(purchaseTransition.price, BigInt(100))
      })
    })
  })

  describe('setters', function () {
    describe('document Create transition', function () {
      it('set data', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newData = { message: 'bebra' }

        createTransition.data = newData

        assert.deepEqual(createTransition.data, newData)
      })

      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        createTransition.base = newBase

        assert.equal(createTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })

      it('set entropy', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newEntropy = new Uint8Array(32)

        createTransition.entropy = newEntropy

        assert.deepEqual(createTransition.entropy, newEntropy)
      })

      it('set prefunded voting balance', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newPrefundedVotingBalance = new wasm.PrefundedVotingBalanceWASM('note', BigInt(9999))

        createTransition.prefundedVotingBalance = newPrefundedVotingBalance

        assert.equal(createTransition.prefundedVotingBalance.indexName, newPrefundedVotingBalance.indexName)
        assert.equal(createTransition.prefundedVotingBalance.credits, newPrefundedVotingBalance.credits)
      })
    })

    describe('document Delete transition', function () {
      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        deleteTransition.base = newBase

        assert.equal(deleteTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })
    })

    describe('document Replace transition', function () {
      it('set data', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newData = { message: 'bebra' }

        replaceTransition.data = newData

        assert.deepEqual(replaceTransition.data, newData)
      })

      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        replaceTransition.base = newBase

        assert.equal(replaceTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })

      it('set revision', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')

        replaceTransition.revision = BigInt(11)

        assert.equal(replaceTransition.revision, BigInt(11))
      })
    })

    describe('document Transfer transition', function () {
      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        transferTransition.base = newBase

        assert.equal(transferTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })

      it('set recipient', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', documentInstance.getOwnerId())

        const newRecipient = new Uint8Array(32)

        transferTransition.recipientId = newRecipient

        assert.deepEqual(transferTransition.recipientId.bytes(), newRecipient)
      })
    })

    describe('document Update Price transition', function () {
      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        updatePriceTransition.base = newBase

        assert.equal(updatePriceTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })

      it('set price', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        updatePriceTransition.price = BigInt(1111)

        assert.deepEqual(updatePriceTransition.price, BigInt(1111))
      })
    })

    describe('document Purchase transition', function () {
      it('set base', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        const newBase = new wasm.DocumentBaseTransitionWASM(
          documentInstance.getId(),
          BigInt(12350),
          'bbbbb',
          dataContractId
        )

        purchaseTransition.base = newBase

        assert.equal(purchaseTransition.base.identityContractNonce, newBase.identityContractNonce)
        assert.notEqual(newBase.__wbg_ptr, 0)
      })

      it('set price', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        purchaseTransition.price = BigInt(1111)

        assert.deepEqual(purchaseTransition.price, BigInt(1111))
      })

      it('set revision', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
        const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

        purchaseTransition.revision = BigInt(1111)

        assert.deepEqual(purchaseTransition.revision, BigInt(1111))
      })
    })
  })
})
