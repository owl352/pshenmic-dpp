import { TokenDestroyFrozenFundsTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenDestroyFrozenFundsTransitionWASM {
  /** @private **/
  _rawTokenDestroyFrozenFundsTransition: TokenDestroyFrozenFundsTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    frozenIdentityId: IdentifierLike,
    publicNote?: string
  ) {
    this._rawTokenDestroyFrozenFundsTransition = new dppProvider.dpp.TokenDestroyFrozenFundsTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(frozenIdentityId),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenDestroyFrozenFundsTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenDestroyFrozenFundsTransition.base = value._rawTokenBaseTransition
  }

  get frozenIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenDestroyFrozenFundsTransition.frozenIdentityId)
  }

  set frozenIdentityId (value: IdentifierLike) {
    this._rawTokenDestroyFrozenFundsTransition.frozenIdentityId = prepareIdentifierValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTokenDestroyFrozenFundsTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenDestroyFrozenFundsTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenDestroyFrozenFundsTransitionNAPI): TokenDestroyFrozenFundsTransitionWASM {
    const instance: TokenDestroyFrozenFundsTransitionWASM = Object.create(this.prototype)
    instance._rawTokenDestroyFrozenFundsTransition = rawInstance

    return instance
  }
}
