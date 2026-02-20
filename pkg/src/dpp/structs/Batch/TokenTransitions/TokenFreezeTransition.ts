import { TokenFreezeTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenFreezeTransitionWASM {
  /** @private **/
  _rawTokenFreezeTransition: TokenFreezeTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    identityIdToFreeze: IdentifierLike,
    publicNote?: string
  ) {
    this._rawTokenFreezeTransition = new dppProvider.dpp.TokenFreezeTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(identityIdToFreeze),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenFreezeTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenFreezeTransition.base = value._rawTokenBaseTransition
  }

  get frozenIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenFreezeTransition.frozenIdentityId)
  }

  set frozenIdentityId (value: IdentifierLike) {
    this._rawTokenFreezeTransition.frozenIdentityId = prepareIdentifierValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTokenFreezeTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenFreezeTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenFreezeTransitionNAPI): TokenFreezeTransitionWASM {
    const instance: TokenFreezeTransitionWASM = Object.create(this.prototype)
    instance._rawTokenFreezeTransition = rawInstance

    return instance
  }
}
