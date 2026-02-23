import type { TokenConfigurationLocalizationNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { TokenConfigurationLocalizationJson } from '../../types.js'

export class TokenConfigurationLocalizationWASM {
  /** @private **/
  _rawTokenConfigurationLocalization: TokenConfigurationLocalizationNAPI

  constructor (shouldCapitalize: boolean, singularForm: string, pluralForm: string) {
    this._rawTokenConfigurationLocalization = new dppProvider.dpp.TokenConfigurationLocalizationNAPI(
      shouldCapitalize,
      singularForm,
      pluralForm
    )
  }

  get shouldCapitalize (): boolean {
    return this._rawTokenConfigurationLocalization.shouldCapitalize
  }

  set shouldCapitalize (shouldCapitalize: boolean) {
    this._rawTokenConfigurationLocalization.shouldCapitalize = shouldCapitalize
  }

  get pluralForm (): string {
    return this._rawTokenConfigurationLocalization.pluralForm
  }

  set pluralForm (pluralForm: string) {
    this._rawTokenConfigurationLocalization.pluralForm = pluralForm
  }

  get singularForm (): string {
    return this._rawTokenConfigurationLocalization.singularForm
  }

  set singularForm (singularForm: string) {
    this._rawTokenConfigurationLocalization.singularForm = singularForm
  }

  toJSON (): TokenConfigurationLocalizationJson {
    return this._rawTokenConfigurationLocalization.toJSON()
  }

  static createFromRawInstance (rawInstance: TokenConfigurationLocalizationNAPI): TokenConfigurationLocalizationWASM {
    const instance: TokenConfigurationLocalizationWASM = Object.create(this.prototype)
    instance._rawTokenConfigurationLocalization = rawInstance

    return instance
  }
}
