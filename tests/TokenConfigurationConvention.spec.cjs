const assert = require('assert')
const { describe, it } = require('mocha')
const { tokenLocalization } = require('./mocks/TokenConfiguration')
const { default: wasm } = require('..')

describe('TokenConfigurationConvention', function () {
  describe('serialization / deserialization', function () {
    it('Should allow to create from object', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      assert.notEqual(convention.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('Should allow to get object of convention in JSON', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      assert.deepEqual(convention.localizations.ru.toJSON(), tokenLocalization)
    })

    it('Should allow to get object of convention in wasm instance', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      assert.deepEqual(convention.localizations.constructor.name, 'Object')
      assert.deepEqual(convention.localizations.ru.constructor.name, 'TokenConfigurationLocalizationWASM')
    })

    it('Should allow to get decimals', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      assert.deepEqual(convention.decimals, 1)
    })
  })

  describe('setters', () => {
    it('Should allow to set localizations object ', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      convention.localizations = {
        en: tokenLocalization
      }

      assert.deepEqual(convention.localizations.constructor.name, 'Object')
      assert.deepEqual(convention.localizations.ru, undefined)
      assert.deepEqual(convention.localizations.en.constructor.name, 'TokenConfigurationLocalizationWASM')
    })

    it('Should allow to set localizations object with wasm ', function () {
      const convention = new wasm.TokenConfigurationConventionWASM({
        ru: tokenLocalization
      },
      1
      )

      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      convention.localizations = {
        en: localization
      }

      assert.deepEqual(convention.localizations.constructor.name, 'Object')
      assert.deepEqual(convention.localizations.ru, undefined)
      assert.deepEqual(convention.localizations.en.constructor.name, 'TokenConfigurationLocalizationWASM')
      assert.deepEqual(convention.localizations.en.toJSON(), {
        shouldCapitalize: false,
        singularForm: 'singularForm',
        pluralForm: 'pluralForm'
      })
      assert.notEqual(localization.__wbg_ptr, 0)
    })
  })
})
