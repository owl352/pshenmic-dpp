const assert = require('assert')
const { describe, it } = require('mocha')
const {
  document, dataContractId, ownerId, documentTypeName, revision, dataContractValue, id, document2, documentBytes
} = require('./mocks/Document/index.js')
const { fromHexString } = require('./utils/hex')
const {initModule} = require('pshenmic-dpp/initAsync')

let wasm

describe('Async Import', function () {
  before(async () => {
    wasm = await initModule();
  })

  describe('Document', function () {
    describe('serialization / deserialization', function () {
      it('should allows to create Document from values', function () {
        const dataContractIdentifier = new wasm.IdentifierWASM(dataContractId)
        const ownerIdentifier = new wasm.IdentifierWASM(ownerId)

        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractIdentifier, ownerIdentifier)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
      })

      it('should allows to create Document from values with custom id', function () {
        const dataContractIdentifier = new wasm.IdentifierWASM(dataContractId)
        const ownerIdentifier = new wasm.IdentifierWASM(ownerId)
        const identifier = new wasm.IdentifierWASM(id)

        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractIdentifier, ownerIdentifier, identifier)

        assert.notEqual(documentInstance.__wbg_ptr, 0)
      })

      it('should allows to create Document from bytes and convert to bytes', function () {
        const dataContract = wasm.DataContractWASM.fromValue(dataContractValue, false)
        const documentInstance = wasm.DocumentWASM.fromBytes(fromHexString(documentBytes), dataContract, 'note')

        const bytes = documentInstance.bytes(dataContract, wasm.PlatformVersionWASM.PLATFORM_V1)

        assert.equal(documentInstance.dataContractId.base58(), dataContract.id.base58())
        assert.deepEqual(bytes, fromHexString(documentBytes))
        assert.notEqual(dataContract.__wbg_ptr, 0)
      })
    })

    describe('getters', function () {
      it('should return document id', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        assert.deepEqual(documentInstance.id.base58(), id)
      })

      it('should return owner id', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        assert.deepEqual(documentInstance.ownerId.base58(), ownerId)
      })

      it('should return data contract id', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        assert.deepEqual(documentInstance.dataContractId.base58(), dataContractId)
      })

      it('should return properties', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        assert.deepEqual(documentInstance.properties, document)
      })

      it('should return revision', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        assert.deepEqual(documentInstance.revision, revision)
      })
    })

    describe('setters', function () {
      it('should allow to set document id', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        documentInstance.id = ownerId

        assert.deepEqual(documentInstance.id.base58(), ownerId)
      })

      it('should allow to set document owner id', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        documentInstance.ownerId = id

        assert.deepEqual(documentInstance.ownerId.base58(), id)
      })

      it('should allow to set entropy', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const newEntropy = new Array(documentInstance.entropy.length).fill(0)

        documentInstance.entropy = newEntropy

        assert.deepEqual(Array.from(documentInstance.entropy), newEntropy)
      })

      it('should allow to set properties', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        documentInstance.properties = document2

        assert.deepEqual(documentInstance.properties, document2)
      })

      it('should allow to set revision', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const newRevision = BigInt(1000)

        documentInstance.revision = newRevision

        assert.deepEqual(documentInstance.revision, newRevision)
      })

      it('should allow to set created at', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const createdAt = BigInt(new Date(1123).getTime())

        documentInstance.createdAt = createdAt

        assert.deepEqual(documentInstance.createdAt, createdAt)
      })

      it('should allow to set updated at', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const updatedAt = BigInt(new Date(1123).getTime())

        documentInstance.updatedAt = updatedAt

        assert.deepEqual(documentInstance.updatedAt, updatedAt)
      })

      it('should allow to set transferred at', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const transferredAt = BigInt(new Date(11231).getTime())

        documentInstance.transferredAt = transferredAt

        assert.deepEqual(documentInstance.transferredAt, transferredAt)
      })

      it('should allow to set create at Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const createdAtHeight = BigInt(9172)

        documentInstance.createdAtBlockHeight = createdAtHeight

        assert.deepEqual(documentInstance.createdAtBlockHeight, createdAtHeight)
      })

      it('should allow to set updated at Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const updatedAtHeight = BigInt(9172)

        documentInstance.updatedAtBlockHeight = updatedAtHeight

        assert.deepEqual(documentInstance.updatedAtBlockHeight, updatedAtHeight)
      })

      it('should allow to set transferred at Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const transferredAtHeight = BigInt(9172)

        documentInstance.transferredAtBlockHeight = transferredAtHeight

        assert.deepEqual(documentInstance.transferredAtBlockHeight, transferredAtHeight)
      })

      it('should allow to set create at core Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const createdAtHeight = 91721

        documentInstance.createdAtCoreBlockHeight = createdAtHeight

        assert.deepEqual(documentInstance.createdAtCoreBlockHeight, createdAtHeight)
      })

      it('should allow to set updated at Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const updatedAtHeight = 91722

        documentInstance.updatedAtCoreBlockHeight = updatedAtHeight

        assert.deepEqual(documentInstance.updatedAtCoreBlockHeight, updatedAtHeight)
      })

      it('should allow to set transferred at Block Height', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const transferredAtHeight = 91723

        documentInstance.transferredAtCoreBlockHeight = transferredAtHeight

        assert.deepEqual(documentInstance.transferredAtCoreBlockHeight, transferredAtHeight)
      })

      it('should allow to set document type name', () => {
        const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

        const newDocumentTypeName = 'bbbb'

        documentInstance.documentTypeName = newDocumentTypeName

        assert.deepEqual(documentInstance.documentTypeName, newDocumentTypeName)
      })
    })

    describe('static', function () {
      it('should allow to generate id', () => {
        const generatedId = wasm.DocumentWASM.generateId('note', ownerId, dataContractId)

        assert.equal(Array.from(generatedId).length, 32)
      })
    })
  })

  describe('DocumentsTransitions', function () {
    describe('serialization / deserialization', function () {
      describe('document Create transition', function () {
        it('should allow to create CreateTransition from document', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(createTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from Create transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = createTransition.toDocumentTransition()

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(createTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = createTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(createTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = createTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(deleteTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from Delete transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = deleteTransition.toDocumentTransition()

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(deleteTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = deleteTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(deleteTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = deleteTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(replaceTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from Replace transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = replaceTransition.toDocumentTransition()

          assert.notEqual(replaceTransition.__wbg_ptr, 0)
          assert.notEqual(replaceTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = replaceTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(replaceTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          const documentTransition = replaceTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(transferTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from Replace transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          const documentTransition = transferTransition.toDocumentTransition()

          assert.notEqual(transferTransition.__wbg_ptr, 0)
          assert.notEqual(transferTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          const documentTransition = transferTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(transferTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          const documentTransition = transferTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from UpdatePrice transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = updatePriceTransition.toDocumentTransition()

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = updatePriceTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(updatePriceTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = updatePriceTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(purchaseTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Transition from PurchaseTransition transition', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = purchaseTransition.toDocumentTransition()

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(purchaseTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
        })

        it('should allow to create Document Batch Transition from Document Transitions', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = purchaseTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

          assert.notEqual(documentInstance.__wbg_ptr, 0)
          assert.notEqual(purchaseTransition.__wbg_ptr, 0)
          assert.notEqual(documentTransition.__wbg_ptr, 0)
          assert.notEqual(batchTransition.__wbg_ptr, 0)
        })

        it('should allow to create state document_transitions from document and convert state transition to document batch', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const documentTransition = purchaseTransition.toDocumentTransition()

          const batchTransition = wasm.BatchTransitionWASM.fromV0Transitions([documentTransition, documentTransition], documentInstance.ownerId, 1, 1)

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
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          assert.deepEqual(createTransition.data, document)
        })

        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          assert.equal(createTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })

        it('get entropy', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          assert.deepEqual(createTransition.entropy, documentInstance.entropy)
        })

        it('get prefunded voting balance', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          assert.equal(createTransition.prefundedVotingBalance, undefined)
        })
      })

      describe('document Delete transition', function () {
        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          assert.equal(deleteTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })
      })

      describe('document Replace transition', function () {
        it('get data', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          assert.deepEqual(replaceTransition.data, document)
        })

        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          assert.equal(replaceTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })

        it('get revision', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          assert.equal(replaceTransition.revision, BigInt(2))
        })
      })

      describe('document Transfer transition', function () {
        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          assert.equal(transferTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })

        it('get recipient', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          assert.deepEqual(transferTransition.recipientId.base58(), documentInstance.ownerId.base58())
        })
      })

      describe('document Update Price transition', function () {
        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.equal(updatePriceTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })

        it('get price', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.deepEqual(updatePriceTransition.price, BigInt(100))
        })
      })

      describe('document Purchase transition', function () {
        it('get base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.equal(purchaseTransition.base.constructor.name, 'DocumentBaseTransitionWASM')
        })

        it('get price', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          assert.deepEqual(purchaseTransition.price, BigInt(100))
        })
      })
    })

    describe('setters', function () {
      describe('document Create transition', function () {
        it('set data', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const newData = { message: 'bebra' }

          createTransition.data = newData

          assert.deepEqual(createTransition.data, newData)
        })

        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const newEntropy = new Uint8Array(32)

          createTransition.entropy = newEntropy

          assert.deepEqual(createTransition.entropy, newEntropy)
        })

        it('set prefunded voting balance', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1))

          const newPrefundedVotingBalance = new wasm.PrefundedVotingBalanceWASM('note', BigInt(9999))

          createTransition.prefundedVotingBalance = newPrefundedVotingBalance

          assert.equal(createTransition.prefundedVotingBalance.indexName, newPrefundedVotingBalance.indexName)
          assert.equal(createTransition.prefundedVotingBalance.credits, newPrefundedVotingBalance.credits)
        })
      })

      describe('document Delete transition', function () {
        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const deleteTransition = new wasm.DocumentDeleteTransitionWASM(documentInstance, BigInt(1))

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          const newData = { message: 'bebra' }

          replaceTransition.data = newData

          assert.deepEqual(replaceTransition.data, newData)
        })

        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1))

          replaceTransition.revision = BigInt(11)

          assert.equal(replaceTransition.revision, BigInt(11))
        })
      })

      describe('document Transfer transition', function () {
        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const transferTransition = new wasm.DocumentTransferTransitionWASM(documentInstance, BigInt(1), documentInstance.ownerId)

          const newRecipient = new Uint8Array(32)

          transferTransition.recipientId = newRecipient

          assert.deepEqual(transferTransition.recipientId.bytes(), newRecipient)
        })
      })

      describe('document Update Price transition', function () {
        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const updatePriceTransition = new wasm.DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          updatePriceTransition.price = BigInt(1111)

          assert.deepEqual(updatePriceTransition.price, BigInt(1111))
        })
      })

      describe('document Purchase transition', function () {
        it('set base', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          const newBase = new wasm.DocumentBaseTransitionWASM(
            documentInstance.id,
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
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          purchaseTransition.price = BigInt(1111)

          assert.deepEqual(purchaseTransition.price, BigInt(1111))
        })

        it('set revision', () => {
          const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
          const purchaseTransition = new wasm.DocumentPurchaseTransitionWASM(documentInstance, BigInt(1), BigInt(100))

          purchaseTransition.revision = BigInt(1111)

          assert.deepEqual(purchaseTransition.revision, BigInt(1111))
        })
      })
    })
  })
})
