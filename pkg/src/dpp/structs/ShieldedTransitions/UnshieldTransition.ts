import type { UnshieldTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js'
import { PlatformAddressLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { preparePlatformAddressValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class UnshieldTransitionWASM {
  /** @private **/
  _rawUnshieldTransition: UnshieldTransitionNAPI

  constructor (
    outputAddress: PlatformAddressLike,
    actions: SerializedActionWASM[],
    unshieldingAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawUnshieldTransition = new dppProvider.dpp.UnshieldTransitionNAPI(
      preparePlatformAddressValue(outputAddress),
      actions.map(a => a._rawSerializedAction),
      unshieldingAmount.toString(),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get outputAddress (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawUnshieldTransition.outputAddress)
  }

  set outputAddress (value: PlatformAddressLike) {
    this._rawUnshieldTransition.outputAddress = preparePlatformAddressValue(value)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawUnshieldTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawUnshieldTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get unshieldingAmount (): bigint {
    return BigInt(this._rawUnshieldTransition.unshieldingAmount)
  }

  set unshieldingAmount (value: bigint) {
    this._rawUnshieldTransition.unshieldingAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawUnshieldTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawUnshieldTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawUnshieldTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawUnshieldTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawUnshieldTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawUnshieldTransition.bindingsSignature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawUnshieldTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): UnshieldTransitionWASM {
    return UnshieldTransitionWASM.createFromRawInstance(
      dppProvider.dpp.UnshieldTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: UnshieldTransitionNAPI): UnshieldTransitionWASM {
    const instance: UnshieldTransitionWASM = Object.create(UnshieldTransitionWASM.prototype)
    instance._rawUnshieldTransition = rawInstance

    return instance
  }
}