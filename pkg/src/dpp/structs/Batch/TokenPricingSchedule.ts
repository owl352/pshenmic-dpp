import type { TokenPricingScheduleNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'

export class TokenPricingScheduleWASM {
  /** @private **/
  _rawTokenPricingSchedule: TokenPricingScheduleNAPI

  constructor (prices: bigint | { [key: string]: bigint }) {
    if (typeof prices === 'bigint') {
      return TokenPricingScheduleWASM.SinglePrice(prices)
    } else {
      return TokenPricingScheduleWASM.SetPrices(prices)
    }
  }

  getScheduleType (): string {
    return this._rawTokenPricingSchedule.getScheduleType()
  }

  getValue (): bigint | { [key: string]: string } {
    const value = this._rawTokenPricingSchedule.getValue()

    if (typeof value === 'string') {
      return BigInt(value)
    } else {
      const normalValue = valueFromDynamicValue(value)

      for (const key of Object.keys(normalValue)) {
        normalValue[key] = BigInt(normalValue[key])
      }

      return normalValue
    }
  }

  static SinglePrice (prices: bigint): TokenPricingScheduleWASM {
    return TokenPricingScheduleWASM.createFromRawInstance(
      dppProvider.dpp.TokenPricingScheduleNAPI.SinglePrice(prices.toString())
    )
  }

  static SetPrices (prices: { [key: string]: bigint }): TokenPricingScheduleWASM {
    return TokenPricingScheduleWASM.createFromRawInstance(
      dppProvider.dpp.TokenPricingScheduleNAPI.SetPrices(valueToDynamicValue(prices))
    )
  }

  static createFromRawInstance (rawInstance: TokenPricingScheduleNAPI): TokenPricingScheduleWASM {
    const instance: TokenPricingScheduleWASM = Object.create(TokenPricingScheduleWASM.prototype)
    instance._rawTokenPricingSchedule = rawInstance

    return instance
  }
}
