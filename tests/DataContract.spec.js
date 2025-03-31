const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { value, bytes, id, ownerId } = require('./mocks/DataContract')
const { PlatformVersionWASM } = require('../wasm/pshenmic_dpp')
const { base58 } = require('@scure/base')

let wasm

describe('DataContract', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('conversations', function () {
    it('should allows to create DataContract from value without full validation', function () {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allows to create DataContract from value with full validation', function () {
      const dataContract = new wasm.DataContractWASM(value, true, PlatformVersionWASM.PLATFORM_V1)

      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allows to create DataContract from value with full validation and without platform version', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allows to convert DataContract to bytes and from bytes', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(Array.from(dataContract.toBytes()), bytes)

      const dataContractFromBytes = wasm.DataContractWASM.fromBytes(dataContract.toBytes(), false, PlatformVersionWASM.PLATFORM_V1)

      assert.notEqual(dataContract.__wbg_ptr, 0)

      assert.deepEqual(Array.from(dataContractFromBytes.toBytes()), bytes)
    })

    it('should allows to create DataContract from bytes without full validation', function () {
      const dataContractFromBytes = wasm.DataContractWASM.fromBytes(bytes, false, PlatformVersionWASM.PLATFORM_V1)
      const dataContractFromValue = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContractFromBytes.toValue(), dataContractFromValue.toValue())
    })

    it('should allows to create DataContract from bytes with full validation and without version', function () {
      const dataContractFromBytes = wasm.DataContractWASM.fromBytes(bytes, true)
      const dataContractFromValue = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContractFromBytes.toValue(), dataContractFromValue.toValue())
    })

    it('should allow to get json', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContract.toJson(), value)
    })
  })

  describe('getters', function () {
    it('should allow to get schemas', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContract.getSchemas(), value.documentSchemas)
    })

    it('should allow to get version', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContract.getDataContractVersion(), value.version)
    })

    it('should allow to get id', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(Array.from(dataContract.getId()), id)
    })

    it('should allow to get owner id', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(Array.from(dataContract.getOwnerId()), ownerId)
    })

    it('should allow to get config', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      assert.deepEqual(dataContract.getConfig(), value.config)
    })
  })

  describe('setters', function () {
    it('should allow to set id', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      const valueId = base58.decode('7ckT6Y19HnjfqoPFmfL995i4z2HwgZ8UttNmP99LtCBH')

      dataContract.setId(Array.from(valueId))

      assert.deepEqual(dataContract.getId(), valueId)
    })

    it('should allow to set owner id', function () {
      const dataContract = new wasm.DataContractWASM(value, true)

      const valueId = base58.decode('3bx13Wd5k4LwHAvXJrayc5HdKPyiccKWYECPQGGYfnVL')

      dataContract.setOwnerId('3bx13Wd5k4LwHAvXJrayc5HdKPyiccKWYECPQGGYfnVL')

      assert.deepEqual(dataContract.getOwnerId(), valueId)
    })
  })

  describe('static', function () {
    it('should allow to generate id', function () {
      const id = wasm.DataContractWASM.generateId('3bx13Wd5k4LwHAvXJrayc5HdKPyiccKWYECPQGGYfnVL', BigInt(4))

      const valueId = base58.decode('7ckT6Y19HnjfqoPFmfL995i4z2HwgZ8UttNmP99LtCBH')

      assert.deepEqual(id, valueId)
    })
  })
})
