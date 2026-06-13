import type { ShieldedWithdrawalTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { CoreScriptWASM } from '../CoreScript.js'
import { PoolingLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { valueToDynamicValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class ShieldedWithdrawalTransitionWASM {
  /** @private **/
  _rawShieldedWithdrawalTransition: ShieldedWithdrawalTransitionNAPI

  constructor (
    actions: SerializedActionWASM[],
    unshieldingAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    coreFeePerByte: number,
    pooling: PoolingLike,
    outputScript: CoreScriptWASM
  ) {
    this._rawShieldedWithdrawalTransition = new dppProvider.dpp.ShieldedWithdrawalTransitionNAPI(
      actions.map(a => a._rawSerializedAction),
      unshieldingAmount.toString(),
      anchor,
      proof,
      bindingsSignature,
      coreFeePerByte,
      valueToDynamicValue(pooling),
      outputScript._rawCoreScript
    )
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldedWithdrawalTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldedWithdrawalTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get unshieldingAmount (): bigint {
    return BigInt(this._rawShieldedWithdrawalTransition.unshieldingAmount)
  }

  set unshieldingAmount (value: bigint) {
    this._rawShieldedWithdrawalTransition.unshieldingAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.bindingsSignature = value
  }

  get coreFeePerByte (): number {
    return this._rawShieldedWithdrawalTransition.coreFeePerByte
  }

  set coreFeePerByte (value: number) {
    this._rawShieldedWithdrawalTransition.coreFeePerByte = value
  }

  get pooling (): string {
    return this._rawShieldedWithdrawalTransition.pooling
  }

  set pooling (value: PoolingLike) {
    this._rawShieldedWithdrawalTransition.pooling = valueToDynamicValue(value)
  }

  get outputScript (): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(this._rawShieldedWithdrawalTransition.outputScript)
  }

  set outputScript (value: CoreScriptWASM) {
    this._rawShieldedWithdrawalTransition.outputScript = value._rawCoreScript
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedWithdrawalTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldedWithdrawalTransitionWASM {
    return ShieldedWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ShieldedWithdrawalTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedWithdrawalTransitionNAPI): ShieldedWithdrawalTransitionWASM {
    const instance: ShieldedWithdrawalTransitionWASM = Object.create(ShieldedWithdrawalTransitionWASM.prototype)
    instance._rawShieldedWithdrawalTransition = rawInstance

    return instance
  }
}