import {TokenKeepsHistoryRulesNAPI} from "../../../../binaries/bindingsTypes.js";
import {dppProvider} from "../../provider.js";

export class TokenKeepsHistoryRulesWASM {
  /** @private **/
  _rawTokenKeepsHistoryRules: TokenKeepsHistoryRulesNAPI

  constructor(keepsTransferHistory: boolean, keepsFreezingHistory: boolean, keepsMintingHistory: boolean, keepsBurningHistory: boolean, keepsDirectPricingHistory: boolean, keepsDirectPurchaseHistory: boolean) {
    this._rawTokenKeepsHistoryRules = new dppProvider.dpp.TokenKeepsHistoryRulesNAPI(
      keepsTransferHistory,
      keepsFreezingHistory,
      keepsMintingHistory,
      keepsBurningHistory,
      keepsDirectPricingHistory,
      keepsDirectPurchaseHistory,
    )
  }

  get keepsTransferHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsTransferHistory
  }

  set keepsTransferHistory(keepsTransferHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsTransferHistory = keepsTransferHistory
  }

  get keepsFreezingHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsFreezingHistory
  }

  set keepsFreezingHistory(keepsFreezingHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsFreezingHistory = keepsFreezingHistory
  }

  get keepsMintingHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsMintingHistory
  }

  set keepsMintingHistory(keepsMintingHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsMintingHistory = keepsMintingHistory
  }

  get keepsBurningHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsBurningHistory
  }

  set keepsBurningHistory(keepsBurningHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsBurningHistory = keepsBurningHistory
  }

  get keepsDirectPricingHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsDirectPricingHistory
  }

  set keepsDirectPricingHistory(keepsDirectPricingHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsDirectPricingHistory = keepsDirectPricingHistory
  }

  get keepsDirectPurchaseHistory(): boolean {
    return this._rawTokenKeepsHistoryRules.keepsDirectPurchaseHistory
  }

  set keepsDirectPurchaseHistory(keepsDirectPurchaseHistory: boolean) {
    this._rawTokenKeepsHistoryRules.keepsDirectPurchaseHistory = keepsDirectPurchaseHistory
  }

  static createFromRawInstance(rawInstance: TokenKeepsHistoryRulesNAPI): TokenKeepsHistoryRulesWASM {
    const instance: TokenKeepsHistoryRulesWASM = Object.create(this.prototype)
    instance._rawTokenKeepsHistoryRules = rawInstance

    return instance
  }
}
