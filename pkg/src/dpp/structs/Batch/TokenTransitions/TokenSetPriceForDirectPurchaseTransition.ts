import { TokenSetPriceForDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenPricingScheduleWASM } from '../TokenPricingSchedule.js'
import { dppProvider } from '../../../provider.js'

export class TokenSetPriceForDirectPurchaseTransitionWASM {
  /** @private **/
  _rawTransition: TokenSetPriceForDirectPurchaseTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    prices?: TokenPricingScheduleWASM,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenSetPriceForDirectPurchaseTransitionNAPI(
      base._rawTokenBaseTransition,
      prices?._rawTokenPricingSchedule,
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTransition.base = value._rawTokenBaseTransition
  }

  get price (): TokenPricingScheduleWASM | undefined {
    const price = this._rawTransition.price

    if (price != null) {
      return TokenPricingScheduleWASM.createFromRawInstance(price)
    }
  }

  set price (value: TokenPricingScheduleWASM | undefined) {
    this._rawTransition.price = value?._rawTokenPricingSchedule
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenSetPriceForDirectPurchaseTransitionNAPI): TokenSetPriceForDirectPurchaseTransitionWASM {
    const instance: TokenSetPriceForDirectPurchaseTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
