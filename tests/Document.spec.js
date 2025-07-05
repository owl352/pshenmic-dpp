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

      ///
      ///
      ///
      const st

      const batch = BatchTransitionWASM.fromST(st)

      const [transition] = batch.transitions

      const documentTransition = transition.toTransition()

      const dataContractId = documentTransition.createTransition.base.dataContractId
      const dataContractId = documentTransition.getCreateTransition().getBase().getDataContractId()
      ///
      ///
      ///

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
