const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const { value } = require('./mocks/DataContract')
const { PlatformVersionWASM } = require('../wasm/pshenmic_dpp')
const { fromHexString } = require('./utils/hex')

let wasm

let dataContractsBytes

describe('DataContract Updatet Transition', function () {
  before(async function () {
    wasm = initWasm()

    dataContractsBytes = [
      '00ea8920edea52fa400de2ccc43052b2821f45585241a2875d4250e35d4ce937c800000000000101000001ab321b19457b1c16b12762509276d47d952f582d978cbd8b50bbfc2fd8a7767d0001046e6f7465160312047479706512066f626a656374120a70726f70657274696573160112076d65737361676516021204747970651206737472696e671208706f736974696f6e030012146164646974696f6e616c50726f706572746965731300'
    ]
  })

  describe('conversations', function () {
    it('should allow to create transitions from data contract', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert transitions to bytes and create from bytes', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const bytes = dataContractTransition.toBytes()

      const newDataContractTransition = wasm.DataContractUpdateTransitionWASM.fromBytes(bytes)

      assert.deepEqual(newDataContractTransition.toBytes(), bytes)
      assert.notEqual(newDataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContractTransition.__wbg_ptr, 0)
      assert.notEqual(dataContract.__wbg_ptr, 0)
    })

    it('should allow to convert data contract transition to state transitions and create data contract transition from state transition', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const stateTransition = dataContractTransition.toStateTransition()

      const newDataContractTransition = wasm.DataContractUpdateTransitionWASM.fromStateTransition(stateTransition)

      assert.deepEqual(dataContractTransition.toBytes(), newDataContractTransition.toBytes())
    })
  })

  describe('getters', function () {
    it('should allow to get feature version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.getFeatureVersion(), 0)
    })

    it('should allow to verify protocol version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      assert.equal(dataContractTransition.verifyProtocolVersion(1), true)
    })

    it('should allow to verify incorrect protocol version', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      try {
        dataContractTransition.verifyProtocolVersion(20)
        assert.equal(true, false)
      } catch (error) {
        assert.equal(false, false)
      }
    })

    it('should allow to get data contract', () => {
      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = dataContractTransition.getDataContract()

      assert.deepEqual(dataContract.toBytes(), newDataContract.toBytes())
    })
  })

  describe('setters', function () {
    it('should allow to set the data contract', () => {
      const [dataContractBytes] = dataContractsBytes

      const dataContract = new wasm.DataContractWASM(value, false, PlatformVersionWASM.PLATFORM_V1)

      const dataContractTransition = new wasm.DataContractUpdateTransitionWASM(dataContract, BigInt(1))

      const newDataContract = wasm.DataContractWASM.fromBytes(fromHexString(dataContractBytes), false, PlatformVersionWASM.PLATFORM_V1)

      dataContractTransition.setDataContract(newDataContract)

      assert.deepEqual(fromHexString(dataContractBytes), newDataContract.toBytes())
    })
  })
})
