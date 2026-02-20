import { TokenSetPriceForDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenPricingScheduleWASM } from '../TokenPricingSchedule.js'
import { dppProvider } from '../../../provider.js'

export class TokenSetPriceForDirectPurchaseTransitionWASM {
  /** @private **/
  _rawTokenSetPriceForDirectPurchaseTransition: TokenSetPriceForDirectPurchaseTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    prices?: TokenPricingScheduleWASM,
    publicNote?: string
  ) {
    this._rawTokenSetPriceForDirectPurchaseTransition = new dppProvider.dpp.TokenSetPriceForDirectPurchaseTransitionNAPI(
      base._rawTokenBaseTransition,
      prices?._rawTokenPricingSchedule,
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenSetPriceForDirectPurchaseTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenSetPriceForDirectPurchaseTransition.base = value._rawTokenBaseTransition
  }

  get price (): TokenPricingScheduleWASM | undefined {
    const price = this._rawTokenSetPriceForDirectPurchaseTransition.price

    if (price != null) {
      return TokenPricingScheduleWASM.createFromRawInstance(price)
    }
  }

  set price (value: TokenPricingScheduleWASM | undefined) {
    this._rawTokenSetPriceForDirectPurchaseTransition.price = value?._rawTokenPricingSchedule
  }

  get publicNote (): string | undefined {
    return this._rawTokenSetPriceForDirectPurchaseTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenSetPriceForDirectPurchaseTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenSetPriceForDirectPurchaseTransitionNAPI): TokenSetPriceForDirectPurchaseTransitionWASM {
    const instance: TokenSetPriceForDirectPurchaseTransitionWASM = Object.create(this.prototype)
    instance._rawTokenSetPriceForDirectPurchaseTransition = rawInstance

    return instance
  }
}
