import type { ShieldedWithdrawalResultNAPI } from '../../../../binaries/bindingsTypes.js'
import { StateTransitionWASM } from '../StateTransition.js'

/** Result of a proving shielded spend (withdrawal / unshield / transfer). */
export class ShieldedWithdrawalResultWASM {
  /** @private **/
  _rawShieldedWithdrawalResult: ShieldedWithdrawalResultNAPI

  get stateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawShieldedWithdrawalResult.stateTransition)
  }

  /** The fixed shielded fee (credits) consensus charges for the spend. */
  get fee (): bigint {
    return BigInt(this._rawShieldedWithdrawalResult.fee)
  }

  static createFromRawInstance (rawInstance: ShieldedWithdrawalResultNAPI): ShieldedWithdrawalResultWASM {
    const instance: ShieldedWithdrawalResultWASM = Object.create(ShieldedWithdrawalResultWASM.prototype)
    instance._rawShieldedWithdrawalResult = rawInstance

    return instance
  }
}