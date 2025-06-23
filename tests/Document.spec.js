const assert = require('assert')
const { describe, it } = require('mocha')
const {
  document, dataContractId, ownerId, documentTypeName, revision, dataContractValue, id, document2, documentBytes
} = require('./mocks/Document')
const { fromHexString } = require('./utils/hex')
const { default: wasm } = require('..')

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

      assert.deepEqual(bytes, fromHexString(documentBytes))
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should return document id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getId().base58(), id)
    })

    it('should return owner id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getOwnerId().base58(), ownerId)
    })

    it('should return data contract id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getDataContractId().base58(), dataContractId)
    })

    it('should return properties', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getProperties(), document)
    })

    it('should return revision', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getRevision(), revision)
    })

    it('should return revision', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      assert.deepEqual(documentInstance.getRevision(), revision)
    })
  })

  describe('setters', function () {
    it('should allow to set document id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      documentInstance.setId(ownerId)

      assert.deepEqual(documentInstance.getId().base58(), ownerId)
    })

    it('should allow to set document owner id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      documentInstance.setOwnerId(id)

      assert.deepEqual(documentInstance.getOwnerId().base58(), id)
    })

    it('should allow to set entropy', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const newEntropy = new Array(documentInstance.getEntropy().length).fill(0)

      documentInstance.setEntropy(newEntropy)

      assert.deepEqual(Array.from(documentInstance.getEntropy()), newEntropy)
    })

    it('should allow to set properties', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      documentInstance.setProperties(document2)

      assert.deepEqual(documentInstance.getProperties(), document2)
    })

    it('should allow to set revision', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const newRevision = BigInt(1000)

      documentInstance.setRevision(newRevision)

      assert.deepEqual(documentInstance.getRevision(), newRevision)
    })

    it('should allow to set created at', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const createdAt = BigInt(new Date(1123).getTime())

      documentInstance.setCreatedAt(createdAt)

      assert.deepEqual(documentInstance.getCreatedAt(), createdAt)
    })

    it('should allow to set updated at', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const updatedAt = BigInt(new Date(1123).getTime())

      documentInstance.setUpdatedAt(updatedAt)

      assert.deepEqual(documentInstance.getUpdatedAt(), updatedAt)
    })

    it('should allow to set transferred at', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const transferredAt = BigInt(new Date(11231).getTime())

      documentInstance.setTransferredAt(transferredAt)

      assert.deepEqual(documentInstance.getTransferredAt(), transferredAt)
    })

    it('should allow to set create at Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const createdAtHeight = BigInt(9172)

      documentInstance.setCreatedAtBlockHeight(createdAtHeight)

      assert.deepEqual(documentInstance.getCreatedAtBlockHeight(), createdAtHeight)
    })

    it('should allow to set updated at Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const updatedAtHeight = BigInt(9172)

      documentInstance.setUpdatedAtBlockHeight(updatedAtHeight)

      assert.deepEqual(documentInstance.getUpdatedAtBlockHeight(), updatedAtHeight)
    })

    it('should allow to set transferred at Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const transferredAtHeight = BigInt(9172)

      documentInstance.setTransferredAtBlockHeight(transferredAtHeight)

      assert.deepEqual(documentInstance.getTransferredAtBlockHeight(), transferredAtHeight)
    })

    it('should allow to set create at core Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const createdAtHeight = 91721

      documentInstance.setCreatedAtCoreBlockHeight(createdAtHeight)

      assert.deepEqual(documentInstance.getCreatedAtCoreBlockHeight(), createdAtHeight)
    })

    it('should allow to set updated at Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const updatedAtHeight = 91722

      documentInstance.setUpdatedAtCoreBlockHeight(updatedAtHeight)

      assert.deepEqual(documentInstance.getUpdatedAtCoreBlockHeight(), updatedAtHeight)
    })

    it('should allow to set transferred at Block Height', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const transferredAtHeight = 91723

      documentInstance.setTransferredAtCoreBlockHeight(transferredAtHeight)

      assert.deepEqual(documentInstance.getTransferredAtCoreBlockHeight(), transferredAtHeight)
    })

    it('should allow to set document type name', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)

      const newDocumentTypeName = 'bbbb'

      documentInstance.setDocumentTypeName(newDocumentTypeName)

      assert.deepEqual(documentInstance.getDocumentTypeName(), newDocumentTypeName)
    })
  })

  describe('static', function () {
    it('should allow to generate id', () => {
      const generatedId = wasm.DocumentWASM.generateId('note', ownerId, dataContractId)

      assert.equal(Array.from(generatedId).length, 32)
    })
  })
})
