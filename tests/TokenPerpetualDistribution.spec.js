const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('TokenPerpetualDistribution', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const distribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient
      )

      assert.notEqual(recipient.__wbg_ptr, 0)
      assert.notEqual(distributionFunction.__wbg_ptr, 0)
      assert.notEqual(distributionType.__wbg_ptr, 0)
      assert.notEqual(distribution.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get distributionType', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const distribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient
      )

      assert.deepEqual(distribution.distributionType.constructor.name, 'RewardDistributionTypeWASM')
    })

    it('should allow to get distributionRecipient', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const distribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient
      )

      assert.deepEqual(distribution.distributionRecipient.constructor.name, 'TokenDistributionRecipientWASM')
      assert.deepEqual(distribution.distributionRecipient.getType(), 'ContractOwner')
    })
  })

  describe('setters', function () {
    it('should allow to set distributionType', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const distribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient
      )

      const newDistribution = wasm.RewardDistributionTypeWASM.TimeBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      distribution.distributionType = newDistribution

      assert.notEqual(newDistribution.__wbg_ptr, 0)
      assert.deepEqual(distribution.distributionType.constructor.name, 'RewardDistributionTypeWASM')
      assert.deepEqual(distribution.distributionType.getDistribution().constructor.name, 'TimeBasedDistributionWASM')
    })

    it('should allow to set distributionRecipient', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const distribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient
      )

      const newRecipient = wasm.TokenDistributionRecipientWASM.EvonodesByParticipation()

      distribution.distributionRecipient = newRecipient

      assert.notEqual(newRecipient.__wbg_ptr, 0)
      assert.deepEqual(distribution.distributionRecipient.constructor.name, 'TokenDistributionRecipientWASM')
      assert.deepEqual(distribution.distributionRecipient.getType(), 'EvonodesByParticipation')
    })
  })
})
