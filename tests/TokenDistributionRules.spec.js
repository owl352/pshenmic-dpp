const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')
const {identifier} = require("./mocks/Identity");

let wasm

describe('TokenDistributionRules', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('shoulda allow to create with undefined values', () => {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      const distributionRules = new wasm.TokenDistributionRulesWASM(
        undefined,
        changeRules,
        undefined,
        undefined,
        changeRules,
        true,
        changeRules,
        changeRules
      )

      assert.notEqual(distributionRules.__wbg_ptr, 0)
      assert.notEqual(changeRules.__wbg_ptr, 0)
    })

    it('shoulda allow to create without undefined values', () => {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            "PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB": BigInt(10000)
          }
        }
      )

      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111),
      )

      const distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )

      const perpetualDistribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient,
      )

      const distributionRules = new wasm.TokenDistributionRulesWASM(
        perpetualDistribution,
        changeRules,
        preProgrammedDistribution,
        identifier,
        changeRules,
        true,
        changeRules,
        changeRules
      )

      assert.notEqual(distributionRules.__wbg_ptr, 0)
      assert.notEqual(perpetualDistribution.__wbg_ptr, 0)
      assert.notEqual(preProgrammedDistribution.__wbg_ptr, 0)
      assert.notEqual(changeRules.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {

  })

  describe('setters', function () {

  })
})


