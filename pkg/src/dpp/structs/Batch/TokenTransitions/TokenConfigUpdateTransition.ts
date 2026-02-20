import { TokenConfigUpdateTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { TokenConfigurationChangeItemWASM } from '../../TokenConfiguration/TokenConfigurationChangeItem.js'
import { dppProvider } from '../../../provider.js'

export class TokenConfigUpdateTransitionWASM {
  /** @private **/
  _rawTokenConfigUpdateTransition: TokenConfigUpdateTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    updateTokenConfigurationItem: TokenConfigurationChangeItemWASM,
    publicNote?: string
  ) {
    this._rawTokenConfigUpdateTransition = new dppProvider.dpp.TokenConfigUpdateTransitionNAPI(
      base._rawTokenBaseTransition,
      updateTokenConfigurationItem._rawTokenConfigurationChangeItem,
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenConfigUpdateTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenConfigUpdateTransition.base = value._rawTokenBaseTransition
  }

  get publicNote (): string | undefined {
    return this._rawTokenConfigUpdateTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenConfigUpdateTransition.publicNote = value
  }

  get updateTokenConfigurationItem (): TokenConfigurationChangeItemWASM {
    return TokenConfigurationChangeItemWASM.createFromRawInstance(this._rawTokenConfigUpdateTransition.updateTokenConfigurationItem)
  }

  set updateTokenConfigurationItem (value: TokenConfigurationChangeItemWASM) {
    this._rawTokenConfigUpdateTransition.updateTokenConfigurationItem = value._rawTokenConfigurationChangeItem
  }

  static createFromRawInstance (rawInstance: TokenConfigUpdateTransitionNAPI): TokenConfigUpdateTransitionWASM {
    const instance: TokenConfigUpdateTransitionWASM = Object.create(this.prototype)
    instance._rawTokenConfigUpdateTransition = rawInstance

    return instance
  }
}
