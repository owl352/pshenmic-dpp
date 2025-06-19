const assert = require('assert')
const {describe, it, before} = require('mocha')
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
    it('shoulda allow to get values', () => {
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

      assert.deepEqual(distributionRules.perpetualDistribution.constructor.name, 'TokenPerpetualDistributionWASM')
      assert.deepEqual(distributionRules.perpetualDistributionRules.constructor.name, 'ChangeControlRulesWASM')
      assert.deepEqual(distributionRules.preProgrammedDistribution.constructor.name, 'TokenPreProgrammedDistributionWASM')
      assert.deepEqual(distributionRules.newTokenDestinationIdentity.constructor.name, 'IdentifierWASM')
      assert.deepEqual(distributionRules.newTokenDestinationIdentityRules.constructor.name, 'ChangeControlRulesWASM')
      assert.deepEqual(distributionRules.mintingAllowChoosingDestination, true)
      assert.deepEqual(distributionRules.mintingAllowChoosingDestinationRules.constructor.name, 'ChangeControlRulesWASM')
      assert.deepEqual(distributionRules.changeDirectPurchasePricingRules.constructor.name, 'ChangeControlRulesWASM')
    })
  })

  describe('setters', function () {
    let noOne

    let changeRules

    let preProgrammedDistribution

    let recipient

    let distributionFunction

    let distributionType

    let perpetualDistribution

    let distributionRules

    before(() => {
      noOne = wasm.AuthorizedActionTakersWASM.NoOne()
      changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )
      preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            "PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB": BigInt(10000)
          }
        }
      )
      recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()
      distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111),
      )
      distributionType = wasm.RewardDistributionTypeWASM.BlockBasedDistribution(
        BigInt(111),
        distributionFunction
      )
      perpetualDistribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        recipient,
      )
      distributionRules = new wasm.TokenDistributionRulesWASM(
        perpetualDistribution,
        changeRules,
        preProgrammedDistribution,
        identifier,
        changeRules,
        true,
        changeRules,
        changeRules
      )
    })

    it('should allow to set mintingAllowChoosingDestination', () => {
      distributionRules.mintingAllowChoosingDestination = false

      assert.deepEqual(distributionRules.mintingAllowChoosingDestination, false)
    })

    it('should allow to set changeDirectPurchasePricingRules', () => {
      const newRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        false,
        false,
        false
      )

      distributionRules.changeDirectPurchasePricingRules = newRules

      assert.notEqual(newRules.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.changeDirectPurchasePricingRules.selfChangingAdminActionTakersAllowed, false)
      assert.deepEqual(distributionRules.changeDirectPurchasePricingRules.changingAdminActionTakersToNoOneAllowed, false)
      assert.deepEqual(distributionRules.changeDirectPurchasePricingRules.changingAuthorizedActionTakersToNoOneAllowed, false)
    })

    it('should allow to set mintingAllowChoosingDestinationRules', () => {
      const newRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        false,
        false,
        false
      )

      distributionRules.mintingAllowChoosingDestinationRules = newRules

      assert.notEqual(newRules.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.mintingAllowChoosingDestinationRules.selfChangingAdminActionTakersAllowed, false)
      assert.deepEqual(distributionRules.mintingAllowChoosingDestinationRules.changingAdminActionTakersToNoOneAllowed, false)
      assert.deepEqual(distributionRules.mintingAllowChoosingDestinationRules.changingAuthorizedActionTakersToNoOneAllowed, false)
    })

    it('should allow to set newTokenDestinationIdentityRules', () => {
      const newRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        false,
        false,
        false
      )

      distributionRules.newTokenDestinationIdentityRules = newRules

      assert.notEqual(newRules.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.newTokenDestinationIdentityRules.selfChangingAdminActionTakersAllowed, false)
      assert.deepEqual(distributionRules.newTokenDestinationIdentityRules.changingAdminActionTakersToNoOneAllowed, false)
      assert.deepEqual(distributionRules.newTokenDestinationIdentityRules.changingAuthorizedActionTakersToNoOneAllowed, false)
    })

    it('should allow to set newTokenDestinationIdentity', () => {
      distributionRules.newTokenDestinationIdentity = '12p3355tKpjLinncBYeMsXkdDYXCbsFzzVmssce6pSJ1'

      assert.deepEqual(distributionRules.newTokenDestinationIdentity.base58(), '12p3355tKpjLinncBYeMsXkdDYXCbsFzzVmssce6pSJ1')
    })

    it('should allow to set preProgrammedDistribution', () => {
      const newPreProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416411: {
            "PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB": BigInt(10011120)
          }
        }
      )

      distributionRules.preProgrammedDistribution = newPreProgrammedDistribution

      assert.notEqual(newPreProgrammedDistribution.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.preProgrammedDistribution.distributions, {
        1750140416411: {
          "PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB": BigInt(10011120)
        }
      })
    })

    it('should allow to set perpetualDistributionRules', () => {
      const newPerpetualDistributionRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        false,
        false,
        false
      )

      distributionRules.perpetualDistributionRules = newPerpetualDistributionRules

      assert.notEqual(newPerpetualDistributionRules.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.perpetualDistributionRules.changingAuthorizedActionTakersToNoOneAllowed, false)
    })

    it('should allow to set perpetualDistribution', () => {
      const newRecipient = wasm.TokenDistributionRecipientWASM.EvonodesByParticipation()

      const newPerpetualDistribution = new wasm.TokenPerpetualDistributionWASM(
        distributionType,
        newRecipient,
      )

      distributionRules.perpetualDistribution = newPerpetualDistribution

      assert.notEqual(newPerpetualDistribution.__wbg_ptr, 0)
      assert.deepEqual(distributionRules.perpetualDistribution.distributionRecipient.getType(), 'EvonodesByParticipation')
    })


  })
})


