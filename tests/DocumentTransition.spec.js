const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { document, documentTypeName, revision, dataContractId, ownerId, id } = require('./mocks/Document')

let wasm
let documentInstance
let createTransition
let replaceTransition

describe('DocumentTransition', function () {
  before(async function () {
    wasm = initWasm()

    documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
    createTransition = new wasm.DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')
    replaceTransition = new wasm.DocumentReplaceTransitionWASM(documentInstance, BigInt(1), 'preorder')
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from documents transitions', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.notEqual(documentTransition.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get action type', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.equal(documentTransition.actionType, 'create')
    })

    it('should allow to get dataContractId', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.deepEqual(documentTransition.dataContractId.base58(), documentInstance.getDataContractId().base58())
    })

    it('should allow to get id', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.deepEqual(documentTransition.id.base58(), documentInstance.getId().base58())
    })

    it('should allow to get documentTypeName', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.equal(documentTransition.documentTypeName, documentTypeName)
    })

    it('should allow to get identityContractNonce', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.equal(documentTransition.identityContractNonce, BigInt(1))
    })

    it('should allow to get revision', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.equal(documentTransition.revision, BigInt(1))
    })

    it('should allow to get entropy', function () {
      const documentTransition = createTransition.toDocumentTransition()

      assert.deepEqual(documentTransition.entropy, documentInstance.getEntropy())
    })
  })

  describe('setters', function () {
    it('should allow to set dataContractId', function () {
      const documentTransition = createTransition.toDocumentTransition()

      documentTransition.dataContractId = new Uint8Array(32)

      assert.deepEqual(documentTransition.dataContractId.bytes(), new Uint8Array(32))
    })

    it('should allow to set identityContractNonce', function () {
      const documentTransition = createTransition.toDocumentTransition()

      documentTransition.identityContractNonce = BigInt(3333)

      assert.equal(documentTransition.identityContractNonce, BigInt(3333))
    })

    it('should allow to set revision', function () {
      const documentTransition = replaceTransition.toDocumentTransition()

      documentTransition.revision = BigInt(123)

      assert.equal(documentTransition.revision, BigInt(123))
    })
  })
})
