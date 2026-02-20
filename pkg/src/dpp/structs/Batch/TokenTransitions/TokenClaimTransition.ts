import { TokenClaimTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenDistributionLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { valueToDynamicValue } from '../../../utils.js'

export class TokenClaimTransitionWASM {
  /** @private **/
  _rawTokenClaimTransition: TokenClaimTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    distributionType: TokenDistributionLike,
    publicNote?: string
  ) {
    this._rawTokenClaimTransition = new dppProvider.dpp.TokenClaimTransitionNAPI(
      base._rawTokenBaseTransition,
      valueToDynamicValue(distributionType),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenClaimTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenClaimTransition.base = value._rawTokenBaseTransition
  }

  get distributionType (): string {
    return this._rawTokenClaimTransition.distributionType
  }

  set distributionType (value: TokenDistributionLike) {
    this._rawTokenClaimTransition.distributionType = valueToDynamicValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTokenClaimTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenClaimTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenClaimTransitionNAPI): TokenClaimTransitionWASM {
    const instance: TokenClaimTransitionWASM = Object.create(this.prototype)
    instance._rawTokenClaimTransition = rawInstance

    return instance
  }
}
