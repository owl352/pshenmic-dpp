import { TokenUnFreezeTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenUnFreezeTransitionWASM {
  /** @private **/
  _rawTokenUnFreezeTransition: TokenUnFreezeTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    frozenIdentityId: IdentifierLike,
    publicNote?: string
  ) {
    this._rawTokenUnFreezeTransition = new dppProvider.dpp.TokenUnFreezeTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(frozenIdentityId),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenUnFreezeTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenUnFreezeTransition.base = value._rawTokenBaseTransition
  }

  get frozenIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnFreezeTransition.frozenIdentityId)
  }

  set frozenIdentityId (value: IdentifierLike) {
    this._rawTokenUnFreezeTransition.frozenIdentityId = prepareIdentifierValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTokenUnFreezeTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenUnFreezeTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenUnFreezeTransitionNAPI): TokenUnFreezeTransitionWASM {
    const instance: TokenUnFreezeTransitionWASM = Object.create(this.prototype)
    instance._rawTokenUnFreezeTransition = rawInstance

    return instance
  }
}
