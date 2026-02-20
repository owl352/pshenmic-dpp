import { TokenDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'

export class TokenDirectPurchaseTransitionWASM {
  /** @private **/
  _rawTokenDirectPurchaseTransition: TokenDirectPurchaseTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    tokenCount: bigint,
    totalAgreedPrice: bigint
  ) {
    this._rawTokenDirectPurchaseTransition = new dppProvider.dpp.TokenDirectPurchaseTransitionNAPI(
      base._rawTokenBaseTransition,
      tokenCount.toString(),
      totalAgreedPrice.toString()
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenDirectPurchaseTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenDirectPurchaseTransition.base = value._rawTokenBaseTransition
  }

  get tokenCount (): bigint {
    return BigInt(this._rawTokenDirectPurchaseTransition.tokenCount)
  }

  set tokenCount (value: bigint) {
    this._rawTokenDirectPurchaseTransition.tokenCount = value.toString()
  }

  get totalAgreedPrice (): bigint {
    return BigInt(this._rawTokenDirectPurchaseTransition.totalAgreedPrice)
  }

  set totalAgreedPrice (value: bigint) {
    this._rawTokenDirectPurchaseTransition.totalAgreedPrice = value.toString()
  }

  static createFromRawInstance (rawInstance: TokenDirectPurchaseTransitionNAPI): TokenDirectPurchaseTransitionWASM {
    const instance: TokenDirectPurchaseTransitionWASM = Object.create(this.prototype)
    instance._rawTokenDirectPurchaseTransition = rawInstance

    return instance
  }
}
