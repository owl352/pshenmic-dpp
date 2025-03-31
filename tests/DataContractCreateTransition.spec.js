const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { value } = require('./mocks/DataContract')
const { PlatformVersionWASM } = require('../wasm/pshenmic_dpp')
const { schema } = require('./mocks/Document')

let wasm

describe('DataContract Create Transition', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('conversations', function () {
    it('should allow to create transitions from data contract', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert transitions to bytes and create from bytes', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      const bytes = dataContractTransition.toBytes()

      const newDataContractTransition = wasm.DataContractCreateTransitionWASM.fromBytes(bytes)

      assert.deepEqual(newDataContractTransition.toBytes(), bytes)
      assert.notEqual(newDataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert data contract transition to state transitions and create data contract transition from state transition', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      const stateTransition = dataContractTransition.toStateTransition()

      const newDataContractTransition = wasm.DataContractCreateTransitionWASM.fromStateTransition(stateTransition)

      assert.deepEqual(dataContractTransition.toBytes(), newDataContractTransition.toBytes())
    })
  })

  describe('getters', function () {
    it('should allow to get feature version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.getFeatureVersion(), 0)
    })

    it('should allow to verify protocol version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.verifyProtocolVersion(1), true)
    })

    it('should allow to verify incorrect protocol version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      try {
        dataContractTransition.verifyProtocolVersion(20)
        assert.equal(true, false)
      } catch (error) {
        assert.equal(false, false)
      }
    })

    it('should allow to get data contract', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = dataContractTransition.getDataContract()

      assert.deepEqual(dataContract.toBytes(), newDataContract.toBytes())
    })
  })

  describe('setters', function () {
    it('should allow to set the data contract', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractCreateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = new wasm.DataContractWASM(schema, false, PlatformVersionWASM.PLATFORM_V1)

      dataContractTransition.setDataContract(newDataContract)

      assert.deepEqual(dataContractTransition.getDataContract().toBytes(), newDataContract.toBytes())
    })
  })
})
