import { TokenBurnTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'

export class TokenBurnTransitionWASM {
  /** @private **/
  _rawTransition: TokenBurnTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    burnAmount: bigint,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenBurnTransitionNAPI(
      base._rawTokenBaseTransition,
      burnAmount.toString(),
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

  get burnAmount (): bigint {
    return BigInt(this._rawTransition.burnAmount)
  }

  set burnAmount (value: bigint) {
    this._rawTransition.burnAmount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenBurnTransitionNAPI): TokenBurnTransitionWASM {
    const instance: TokenBurnTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
