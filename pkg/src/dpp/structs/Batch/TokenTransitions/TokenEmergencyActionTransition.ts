import { TokenEmergencyActionTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { dppProvider } from '../../../provider.js'
import { TokenEmergencyActionLike } from '../../../types.js'
import { valueToDynamicValue } from '../../../utils.js'

export class TokenEmergencyActionTransitionWASM {
  /** @private **/
  _rawTokenEmergencyActionTransition: TokenEmergencyActionTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    emergencyAction: TokenEmergencyActionLike,
    publicNote?: string
  ) {
    this._rawTokenEmergencyActionTransition = new dppProvider.dpp.TokenEmergencyActionTransitionNAPI(
      base._rawTokenBaseTransition,
      valueToDynamicValue(emergencyAction),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenEmergencyActionTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenEmergencyActionTransition.base = value._rawTokenBaseTransition
  }

  get emergencyAction (): string {
    return this._rawTokenEmergencyActionTransition.emergencyAction
  }

  set emergencyAction (value: TokenEmergencyActionLike) {
    this._rawTokenEmergencyActionTransition.emergencyAction = valueToDynamicValue(value)
  }

  get publicNote (): string | undefined {
    return this._rawTokenEmergencyActionTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenEmergencyActionTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenEmergencyActionTransitionNAPI): TokenEmergencyActionTransitionWASM {
    const instance: TokenEmergencyActionTransitionWASM = Object.create(this.prototype)
    instance._rawTokenEmergencyActionTransition = rawInstance

    return instance
  }
}
