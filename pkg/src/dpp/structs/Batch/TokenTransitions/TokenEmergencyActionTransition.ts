import type { TokenEmergencyActionTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'
import { TokenEmergencyActionLike } from '../../../types.js'
import { valueToDynamicValue } from '../../../utils.js'

export class TokenEmergencyActionTransitionWASM {
  /** @private **/
  _rawTransition: TokenEmergencyActionTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    emergencyAction: TokenEmergencyActionLike,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenEmergencyActionTransitionNAPI(
      base._rawTokenBaseTransition,
      valueToDynamicValue(emergencyAction),
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

  get emergencyAction (): string {
    return this._rawTransition.emergencyAction
  }

  set emergencyAction (value: TokenEmergencyActionLike) {
    this._rawTransition.emergencyAction = valueToDynamicValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenEmergencyActionTransitionNAPI): TokenEmergencyActionTransitionWASM {
    const instance: TokenEmergencyActionTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
