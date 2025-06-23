const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('RewardDistributionType', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('shoulda allow to create BlockBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
      assert.notEqual(distributionType.__wbg_ptr, 0)
    })

    it('shoulda allow to create TimeBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.TimeBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
      assert.notEqual(distributionType.__wbg_ptr, 0)
    })

    it('shoulda allow to create EpochBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.EpochBasedDistribution(
        111,
        distributionFunction
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
      assert.notEqual(distributionType.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('shoulda allow return value BlockBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      assert.equal(distributionType.getDistribution().constructor.name, 'BlockBasedDistributionWASM')
    })

    it('shoulda allow return value TimeBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.TimeBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      assert.equal(distributionType.getDistribution().constructor.name, 'TimeBasedDistributionWASM')
    })

    it('shoulda allow return value EpochBasedDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.EpochBasedDistribution(
        111,
        distributionFunction
      )

      assert.equal(distributionType.getDistribution().constructor.name, 'EpochBasedDistributionWASM')
    })
  })
})
