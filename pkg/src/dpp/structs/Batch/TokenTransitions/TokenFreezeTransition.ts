import type { TokenFreezeTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenFreezeTransitionWASM {
  /** @private **/
  _rawTransition: TokenFreezeTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    identityIdToFreeze: IdentifierLike,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenFreezeTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(identityIdToFreeze),
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

  get frozenIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.frozenIdentityId)
  }

  set frozenIdentityId (value: IdentifierLike) {
    this._rawTransition.frozenIdentityId = prepareIdentifierValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenFreezeTransitionNAPI): TokenFreezeTransitionWASM {
    const instance: TokenFreezeTransitionWASM = Object.create(TokenFreezeTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
