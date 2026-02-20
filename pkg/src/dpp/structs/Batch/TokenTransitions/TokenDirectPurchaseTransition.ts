import { TokenDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'

export class TokenDirectPurchaseTransitionWASM {
  /** @private **/
  _rawTransition: TokenDirectPurchaseTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    tokenCount: bigint,
    totalAgreedPrice: bigint
  ) {
    this._rawTransition = new dppProvider.dpp.TokenDirectPurchaseTransitionNAPI(
      base._rawTokenBaseTransition,
      tokenCount.toString(),
      totalAgreedPrice.toString()
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

  get tokenCount (): bigint {
    return BigInt(this._rawTransition.tokenCount)
  }

  set tokenCount (value: bigint) {
    this._rawTransition.tokenCount = value.toString()
  }

  get totalAgreedPrice (): bigint {
    return BigInt(this._rawTransition.totalAgreedPrice)
  }

  set totalAgreedPrice (value: bigint) {
    this._rawTransition.totalAgreedPrice = value.toString()
  }

  static createFromRawInstance (rawInstance: TokenDirectPurchaseTransitionNAPI): TokenDirectPurchaseTransitionWASM {
    const instance: TokenDirectPurchaseTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
