const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('ChangeControlRules', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create rules from values', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.notEqual(noOne.__wbg_ptr, 0)
      assert.notEqual(changeRules.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get authorizedToMakeChange', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.deepEqual(changeRules.authorizedToMakeChange.constructor.name, 'AuthorizedActionTakersWASM')
    })

    it('should allow to get adminActionTakers', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.deepEqual(changeRules.adminActionTakers.constructor.name, 'AuthorizedActionTakersWASM')
    })

    it('should allow to get changingAuthorizedActionTakersToNoOneAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.deepEqual(changeRules.changingAuthorizedActionTakersToNoOneAllowed, true)
    })

    it('should allow to get changingAdminActionTakersToNoOneAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.deepEqual(changeRules.changingAdminActionTakersToNoOneAllowed, true)
    })

    it('should allow to get selfChangingAdminActionTakersAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      assert.deepEqual(changeRules.selfChangingAdminActionTakersAllowed, true)
    })
  })

  describe('setters', function () {
    it('should allow to set authorizedToMakeChange', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      const newActionTaker = wasm.AuthorizedActionTakersWASM.ContractOwner()

      changeRules.authorizedToMakeChange = newActionTaker

      assert.deepEqual(changeRules.authorizedToMakeChange.constructor.name, 'AuthorizedActionTakersWASM')
      assert.deepEqual(changeRules.authorizedToMakeChange.getTakerType(), 'ContractOwner')
      assert.notEqual(newActionTaker.__wbg_ptr, 0)
    })

    it('should allow to set adminActionTakers', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      const newActionTaker = wasm.AuthorizedActionTakersWASM.ContractOwner()

      changeRules.adminActionTakers = newActionTaker

      assert.deepEqual(changeRules.adminActionTakers.constructor.name, 'AuthorizedActionTakersWASM')
      assert.deepEqual(changeRules.adminActionTakers.getTakerType(), 'ContractOwner')
      assert.notEqual(newActionTaker.__wbg_ptr, 0)
    })

    it('should allow to set changingAuthorizedActionTakersToNoOneAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      changeRules.changingAuthorizedActionTakersToNoOneAllowed = false

      assert.deepEqual(changeRules.changingAuthorizedActionTakersToNoOneAllowed, false)
    })

    it('should allow to set changingAdminActionTakersToNoOneAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      changeRules.changingAdminActionTakersToNoOneAllowed = false

      assert.deepEqual(changeRules.changingAdminActionTakersToNoOneAllowed, false)
    })

    it('should allow to set selfChangingAdminActionTakersAllowed', function () {
      const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

      const changeRules = new wasm.ChangeControlRulesWASM(
        noOne,
        noOne,
        true,
        true,
        true
      )

      changeRules.selfChangingAdminActionTakersAllowed = false

      assert.deepEqual(changeRules.selfChangingAdminActionTakersAllowed, false)
    })
  })
})
