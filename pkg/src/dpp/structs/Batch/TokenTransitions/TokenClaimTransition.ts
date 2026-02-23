import type { TokenClaimTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenDistributionLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { valueToDynamicValue } from '../../../utils.js'

export class TokenClaimTransitionWASM {
  /** @private **/
  _rawTransition: TokenClaimTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    distributionType: TokenDistributionLike,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenClaimTransitionNAPI(
      base._rawTokenBaseTransition,
      valueToDynamicValue(distributionType),
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

  get distributionType (): string {
    return this._rawTransition.distributionType
  }

  set distributionType (value: TokenDistributionLike) {
    this._rawTransition.distributionType = valueToDynamicValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenClaimTransitionNAPI): TokenClaimTransitionWASM {
    const instance: TokenClaimTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
