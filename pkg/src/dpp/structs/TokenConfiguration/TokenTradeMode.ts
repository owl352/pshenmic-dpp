import type { TokenTradeModeNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class TokenTradeModeWASM {
  /** @private **/
  _rawTokenTradeMode: TokenTradeModeNAPI

  private constructor (rawInstance: TokenTradeModeNAPI) {
    this._rawTokenTradeMode = rawInstance
  }

  getValue (): string {
    return this._rawTokenTradeMode.getValue()
  }

  static NotTradeable (): TokenTradeModeWASM {
    return TokenTradeModeWASM.createFromRawInstance(dppProvider.dpp.TokenTradeModeNAPI.NotTradeable())
  }

  static createFromRawInstance (rawInstance: TokenTradeModeNAPI): TokenTradeModeWASM {
    return new TokenTradeModeWASM(rawInstance)
  }
}
