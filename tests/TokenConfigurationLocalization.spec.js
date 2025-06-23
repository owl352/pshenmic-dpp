const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('TokenConfigurationLocalization', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      assert.notEqual(localization.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get shouldCapitalize', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      assert.equal(localization.shouldCapitalize, false)
    })

    it('should allow to get pluralForm', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      assert.equal(localization.pluralForm, 'pluralForm')
    })

    it('should allow to get singularForm', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      assert.equal(localization.singularForm, 'singularForm')
    })
  })

  describe('setters', function () {
    it('should allow to set shouldCapitalize', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      localization.shouldCapitalize = true

      assert.equal(localization.shouldCapitalize, true)
    })

    it('should allow to set pluralForm', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      localization.pluralForm = 'pluralForm1212'

      assert.equal(localization.pluralForm, 'pluralForm1212')
    })

    it('should allow to set singularForm', () => {
      const localization = new wasm.TokenConfigurationLocalizationWASM(false, 'singularForm', 'pluralForm')

      localization.singularForm = 'singularForm12121'

      assert.equal(localization.singularForm, 'singularForm12121')
    })
  })
})
