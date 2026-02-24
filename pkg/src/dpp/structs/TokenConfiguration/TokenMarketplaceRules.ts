import type { TokenMarketplaceRulesNAPI } from '../../../../binaries/bindingsTypes.js'
import { TokenTradeModeWASM } from './TokenTradeMode.js'
import { ChangeControlRulesWASM } from './ChangeControlRules.js'
import { dppProvider } from '../../provider.js'

export class TokenMarketplaceRulesWASM {
  /** @private **/
  _rawTokenMarketplaceRules: TokenMarketplaceRulesNAPI

  constructor (tradeMode: TokenTradeModeWASM, tradeModeChangeRules: ChangeControlRulesWASM) {
    this._rawTokenMarketplaceRules = new dppProvider.dpp.TokenMarketplaceRulesNAPI(
      tradeMode._rawTokenTradeMode,
      tradeModeChangeRules._rawChangeControlRules
    )
  }

  get tradeMode (): TokenTradeModeWASM {
    return TokenTradeModeWASM.createFromRawInstance(this._rawTokenMarketplaceRules.tradeMode)
  }

  set tradeMode (value: TokenTradeModeWASM) {
    this._rawTokenMarketplaceRules.tradeMode = value._rawTokenTradeMode
  }

  get tradeModeChangeRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenMarketplaceRules.tradeModeChangeRules)
  }

  set tradeModeChangeRules (value: ChangeControlRulesWASM) {
    this._rawTokenMarketplaceRules.tradeModeChangeRules = value._rawChangeControlRules
  }

  static createFromRawInstance (rawInstance: TokenMarketplaceRulesNAPI): TokenMarketplaceRulesWASM {
    const instance: TokenMarketplaceRulesWASM = Object.create(TokenMarketplaceRulesWASM.prototype)
    instance._rawTokenMarketplaceRules = rawInstance

    return instance
  }
}
