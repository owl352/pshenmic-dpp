const assert = require('assert')
const { describe, it } = require('mocha')
const { value, dataContractsBytes } = require('./mocks/DataContract')
const { PlatformVersionWASM } = require('..')
const { fromHexString } = require('./utils/hex')
const { default: wasm } = require('..')

describe('DataContract Updatet Transition', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create document_transitions from data contract', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert document_transitions to bytes and create from bytes', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const bytes = dataContractTransition.bytes()

      const newDataContractTransition = wasm.DataContractUpdateTransitionWASM.fromBytes(bytes)

      assert.deepEqual(newDataContractTransition.bytes(), bytes)
      assert.notEqual(newDataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert data contract transition to state document_transitions and create data contract transition from state transition', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const stateTransition = dataContractTransition.toStateTransition()

      const newDataContractTransition = wasm.DataContractUpdateTransitionWASM.fromStateTransition(stateTransition)

      assert.deepEqual(dataContractTransition.bytes(), newDataContractTransition.bytes())
    })
  })

  describe('getters', function () {
    it('should allow to get feature version', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.featureVersion, 0)
    })

    it('should allow to verify protocol version', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.verifyProtocolVersion(1), true)
    })

    it('should allow to verify incorrect protocol version', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      try {
        dataContractTransition.verifyProtocolVersion(20)
        assert.equal(true, false)
      } catch (error) {
        assert.equal(false, false)
      }
    })

    it('should allow to get data contract', () => {
      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = dataContractTransition.getDataContract()

      assert.deepEqual(dataContract.bytes(), newDataContract.bytes())
    })
  })

  describe('setters', function () {
    it('should allow to set the data contract', () => {
      const [dataContractBytes] = dataContractsBytes

      const dataContract = wasm.DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = wasm.DataContractWASM.fromBytes(fromHexString(dataContractBytes), false, PlatformVersionWASM.PLATFORM_V1)

      dataContractTransition.setDataContract(newDataContract)

      assert.deepEqual(fromHexString(dataContractBytes), newDataContract.bytes())
    })
  })
})
