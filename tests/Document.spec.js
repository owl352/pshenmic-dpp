const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const {document, dataContractId, ownerId, documentTypeName, revision, documentBytes, schema, idBytes} = require('./mocks/Document')
const {PlatformVersionWASM} = require("../wasm/pshenmic_dpp");

let wasm

describe('Document', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('conversations', function () {
    it('should allows to create Document from values', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId)

      assert.notEqual(documentInstance.__wbg_ptr, 0)
    })

    it('should allows to create Document from bytes and convert to bytes', function () {
      const dataContract = new wasm.DataContractWASM(schema, false)
      const documentInstance = wasm.DocumentWASM.fromBytes(documentBytes, dataContract, 'note')

      const bytes = documentInstance.toBytes(dataContract, 'note')

      assert.deepEqual(Array.from(bytes), documentBytes)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should return document id', () => {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId)

      assert.deepEqual(Array.from(documentInstance.getId()), idBytes)
    });
  })
})
