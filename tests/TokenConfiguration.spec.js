const initWasm = require('./utils/wasm')
const assert = require('assert')
const {describe, it, before} = require('mocha')

let wasm

describe('TokenConfiguration', function () {
  let config

  before(async function () {
    wasm = initWasm()

    const convention = new wasm.TokenConfigurationConventionWASM({
        ru: {
          shouldCapitalize: true,
          singularForm: 'TOKEN',
          pluralForm: 'TOKENS'
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
      true
    )

    const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
      {
        1750140416485: {
          PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
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

    config = new wasm.TokenConfigurationWASM(
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
      'note'
    )
  })

  describe('serialization / deserialization', function () {
    it('Should allow to create from values', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
          ru: {
            shouldCapitalize: true,
            singularForm: 'TOKEN',
            pluralForm: 'TOKENS'
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
        true
      )

      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
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

      const configTest = new wasm.TokenConfigurationWASM(
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
        'note'
      )

      assert.notEqual(configTest.__wbg_ptr, 0)
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
    it('should allow to get getters', () => {
      assert.equal(config.conventions.constructor.name, 'TokenConfigurationConventionWASM')
      assert.equal(config.conventionsChangeRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.baseSupply.constructor.name, 'BigInt')
      assert.equal(config.keepsHistory.constructor.name, 'TokenKeepsHistoryRulesWASM')
      assert.equal(config.startAsPaused.constructor.name, 'Boolean')
      assert.equal(config.isAllowedTransferToFrozenBalance.constructor.name, 'Boolean')
      assert.equal(config.maxSupply, undefined)
      assert.equal(config.maxSupplyChangeRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.distributionRules.constructor.name, 'TokenDistributionRulesWASM')
      assert.equal(config.marketplaceRules.constructor.name, 'TokenMarketplaceRulesWASM')
      assert.equal(config.manualMintingRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.manualBurningRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.freezeRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.unfreezeRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.destroyFrozenFundsRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.emergencyActionRules.constructor.name, 'ChangeControlRulesWASM')
      assert.equal(config.mainControlGroup, undefined)
      assert.equal(config.description.constructor.name, 'String')
    })
  })

  describe('setters', function () {

  })
})
