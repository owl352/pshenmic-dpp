import type {
  TokenConfigurationConventionNAPI,
  TokenConfigurationLocalizationNAPI
} from '../../../../binaries/bindingsTypes.js'
import { ISO639_CODES } from '../../types.js'
import { TokenConfigurationLocalizationWASM } from './TokenConfigurationLocalization.js'
import { dppProvider } from '../../provider.js'

export class TokenConfigurationConventionWASM {
  /** @private **/
  _rawTokenConfigurationConvention: TokenConfigurationConventionNAPI

  constructor (localization: { [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM }, decimals: number) {
    const keys = Object.keys(localization) as ISO639_CODES[]
    const normalLocalization: Array<[string, TokenConfigurationLocalizationNAPI]> = []

    for (const key of keys) {
      if (localization[key] == null) {
        throw new Error(`Localization cannot be undefined (${key})`)
      }
      normalLocalization.push([key, localization[key]._rawTokenConfigurationLocalization])
    }

    this._rawTokenConfigurationConvention = new dppProvider.dpp.TokenConfigurationConventionNAPI(normalLocalization, decimals)
  }

  get decimals (): number {
    return this._rawTokenConfigurationConvention.decimals
  }

  set decimals (value: number) {
    this._rawTokenConfigurationConvention.decimals = value
  }

  get localizations (): { [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM } {
    const out: { [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM } = {}
    const localizations = this._rawTokenConfigurationConvention.localizations

    for (const [langCode, localization] of localizations) {
      out[langCode as ISO639_CODES] = TokenConfigurationLocalizationWASM.createFromRawInstance(localization)
    }

    return out
  }

  set localizations (localization: { [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM }) {
    const keys = Object.keys(localization) as ISO639_CODES[]
    const normalLocalization: Array<[string, TokenConfigurationLocalizationNAPI]> = []

    for (const key of keys) {
      if (localization[key] == null) {
        throw new Error(`Localization cannot be undefined (${key})`)
      }
      normalLocalization.push([key, localization[key]._rawTokenConfigurationLocalization])
    }

    this._rawTokenConfigurationConvention.localizations = normalLocalization
  }

  static createFromRawInstance (rawInstance: TokenConfigurationConventionNAPI): TokenConfigurationConventionWASM {
    const instance: TokenConfigurationConventionWASM = Object.create(this.prototype)
    instance._rawTokenConfigurationConvention = rawInstance

    return instance
  }
}
