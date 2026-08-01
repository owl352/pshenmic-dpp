import type { PlatformVersionNAPI, ShieldedTransferTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { dppProvider } from '../../provider.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class ShieldedTransferTransitionWASM {
  /** @private **/
  _rawShieldedTransferTransition: ShieldedTransferTransitionNAPI

  constructor (
    actions: SerializedActionWASM[],
    valueBalance: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawShieldedTransferTransition = new dppProvider.dpp.ShieldedTransferTransitionNAPI(
      actions.map(a => a._rawSerializedAction),
      valueBalance.toString(),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldedTransferTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldedTransferTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get valueBalance (): bigint {
    return BigInt(this._rawShieldedTransferTransition.valueBalance)
  }

  set valueBalance (value: bigint) {
    this._rawShieldedTransferTransition.valueBalance = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldedTransferTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldedTransferTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldedTransferTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldedTransferTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldedTransferTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldedTransferTransition.bindingsSignature = value
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(dppProvider.dpp.ShieldedTransferTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedTransferTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldedTransferTransitionWASM {
    return ShieldedTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ShieldedTransferTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedTransferTransitionNAPI): ShieldedTransferTransitionWASM {
    const instance: ShieldedTransferTransitionWASM = Object.create(ShieldedTransferTransitionWASM.prototype)
    instance._rawShieldedTransferTransition = rawInstance

    return instance
  }
}