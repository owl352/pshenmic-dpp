const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const {document, dataContractId, ownerId, documentTypeName, revision, documentBytes, schema} = require('./mocks/Document')
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

    it('should allows to convert Document to bytes', function () {
      const documentInstance = new wasm.DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId)
      const dataContract = new wasm.DataContractWASM(schema, false)

      const t = wasm.DocumentWASM.fromBytes(documentBytes, dataContract, 'note', PlatformVersionWASM.PLATFORM_V1)

      assert.notEqual(documentInstance.__wbg_ptr, 0)

      const bytes = documentInstance.toBytes(dataContract, 'note')

      assert.deepEqual(Array.from(bytes), documentBytes)

    })
  })
})
