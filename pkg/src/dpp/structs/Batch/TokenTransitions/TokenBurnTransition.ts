import { TokenBurnTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'

export class TokenBurnTransitionWASM {
  /** @private **/
  _rawTokenBurnTransition: TokenBurnTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    burnAmount: bigint,
    publicNote?: string
  ) {
    this._rawTokenBurnTransition = new dppProvider.dpp.TokenBurnTransitionNAPI(
      base._rawTokenBaseTransition,
      burnAmount.toString(),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenBurnTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenBurnTransition.base = value._rawTokenBaseTransition
  }

  get burnAmount (): bigint {
    return BigInt(this._rawTokenBurnTransition.burnAmount)
  }

  set burnAmount (value: bigint) {
    this._rawTokenBurnTransition.burnAmount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTokenBurnTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenBurnTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenBurnTransitionNAPI): TokenBurnTransitionWASM {
    const instance: TokenBurnTransitionWASM = Object.create(this.prototype)
    instance._rawTokenBurnTransition = rawInstance

    return instance
  }
}
