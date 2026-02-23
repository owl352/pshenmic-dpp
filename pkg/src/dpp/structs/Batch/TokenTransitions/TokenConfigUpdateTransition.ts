import type { TokenConfigUpdateTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenConfigurationChangeItemWASM } from '../../TokenConfiguration/TokenConfigurationChangeItem.js'
import { dppProvider } from '../../../provider.js'

export class TokenConfigUpdateTransitionWASM {
  /** @private **/
  _rawTransition: TokenConfigUpdateTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    updateTokenConfigurationItem: TokenConfigurationChangeItemWASM,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenConfigUpdateTransitionNAPI(
      base._rawTokenBaseTransition,
      updateTokenConfigurationItem._rawTokenConfigurationChangeItem,
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

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  get updateTokenConfigurationItem (): TokenConfigurationChangeItemWASM {
    return TokenConfigurationChangeItemWASM.createFromRawInstance(this._rawTransition.updateTokenConfigurationItem)
  }

  set updateTokenConfigurationItem (value: TokenConfigurationChangeItemWASM) {
    this._rawTransition.updateTokenConfigurationItem = value._rawTokenConfigurationChangeItem
  }

  static createFromRawInstance (rawInstance: TokenConfigUpdateTransitionNAPI): TokenConfigUpdateTransitionWASM {
    const instance: TokenConfigUpdateTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
