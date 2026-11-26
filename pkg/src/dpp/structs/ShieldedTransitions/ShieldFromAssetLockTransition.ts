import type { PlatformVersionNAPI, ShieldFromAssetLockTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js'
import { PlatformAddressLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { preparePlatformAddressValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class ShieldFromAssetLockTransitionWASM {
  /** @private **/
  _rawShieldFromAssetLockTransition: ShieldFromAssetLockTransitionNAPI

  constructor (
    assetLockProof: AssetLockProofWASM,
    actions: SerializedActionWASM[],
    valueBalance: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    surplusOutput?: PlatformAddressLike
  ) {
    this._rawShieldFromAssetLockTransition = new dppProvider.dpp.ShieldFromAssetLockTransitionNAPI(
      assetLockProof._rawAssetLockProof,
      actions.map(a => a._rawSerializedAction),
      valueBalance.toString(),
      anchor,
      proof,
      bindingsSignature,
      surplusOutput != null ? preparePlatformAddressValue(surplusOutput) : undefined
    )
  }

  get assetLockProof (): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(this._rawShieldFromAssetLockTransition.assetLockProof)
  }

  set assetLockProof (value: AssetLockProofWASM) {
    this._rawShieldFromAssetLockTransition.assetLockProof = value._rawAssetLockProof
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldFromAssetLockTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldFromAssetLockTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get valueBalance (): bigint {
    return BigInt(this._rawShieldFromAssetLockTransition.valueBalance)
  }

  set valueBalance (value: bigint) {
    this._rawShieldFromAssetLockTransition.valueBalance = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.bindingsSignature = value
  }

  get surplusOutput (): PlatformAddressWASM | undefined {
    const output = this._rawShieldFromAssetLockTransition.surplusOutput

    if (output != null) {
      return PlatformAddressWASM.createFromRawInstance(output)
    }
  }

  set surplusOutput (value: PlatformAddressLike | undefined) {
    this._rawShieldFromAssetLockTransition.surplusOutput = value != null
      ? preparePlatformAddressValue(value)
      : undefined
  }

  get signature (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.signature = value
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(dppProvider.dpp.ShieldFromAssetLockTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldFromAssetLockTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldFromAssetLockTransitionWASM {
    return ShieldFromAssetLockTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ShieldFromAssetLockTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldFromAssetLockTransitionNAPI): ShieldFromAssetLockTransitionWASM {
    const instance: ShieldFromAssetLockTransitionWASM = Object.create(ShieldFromAssetLockTransitionWASM.prototype)
    instance._rawShieldFromAssetLockTransition = rawInstance

    return instance
  }
}