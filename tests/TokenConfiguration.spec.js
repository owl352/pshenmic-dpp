const initWasm = require('./utils/wasm')
const assert = require('assert')
const { describe, it, before } = require('mocha')

let wasm

describe('TokenConfiguration', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('Should allow to create from values', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
          ru: {
            shouldCapitalize: true,
            singularForm: "TOKEN",
            pluralForm: "TOKENS",
          }
        },
        1
      )

      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      const keepHistory = new wasm.TokenKeepsHistoryRulesWASM(
        true,
        true,
        true,
        true,
        true,
        true,
      )

      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            "PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB": BigInt(10000)
          }
        }
      )

      const distributionRules = new wasm.TokenDistributionRulesWASM(
        undefined,
        changeRules,
        preProgrammedDistribution,
        undefined,
        changeRules,
        true,
        changeRules,
        changeRules
      )

      const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

      const marketplaceRules = new wasm.TokenMarketplaceRulesWASM(
        tradeMode,
        changeRules
      )

      const config = new wasm.TokenConfigurationWASM(
        convention,
        changeRules,
        BigInt(999999999),
        undefined,
        keepHistory,
        false,
        false,
        changeRules,
        distributionRules,
        marketplaceRules,
        changeRules,
        changeRules,
        changeRules,
        changeRules,
        changeRules,
        changeRules,
        undefined,
        noOne,
        "note"
      )

      assert.notEqual(config.__wbg_ptr, 0)
      assert.notEqual(preProgrammedDistribution.__wbg_ptr, 0)
      assert.notEqual(marketplaceRules.__wbg_ptr, 0)
      assert.notEqual(tradeMode.__wbg_ptr, 0)
      assert.notEqual(distributionRules.__wbg_ptr, 0)
      assert.notEqual(keepHistory.__wbg_ptr, 0)
      assert.notEqual(changeRules.__wbg_ptr, 0)
      assert.notEqual(noOne.__wbg_ptr, 0)
      assert.notEqual(convention.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {

  })

  describe('setters', function () {

  })
})
