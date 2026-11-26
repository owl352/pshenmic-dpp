import type { PlatformVersionNAPI, ShieldTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { InputAddressWASM } from '../AddressTransitions/entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from '../AddressTransitions/entities/AddressFundsFeeStrategyStep.js'
import { AddressWitnessWASM } from '../PlatformAddress/AddressWitness.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { dppProvider } from '../../provider.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class ShieldTransitionWASM {
  /** @private **/
  _rawShieldTransition: ShieldTransitionNAPI

  constructor (
    inputs: InputAddressWASM[],
    actions: SerializedActionWASM[],
    amount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitnesses: AddressWitnessWASM[]
  ) {
    this._rawShieldTransition = new dppProvider.dpp.ShieldTransitionNAPI(
      inputs.map(i => i._rawInputAddress),
      actions.map(a => a._rawSerializedAction),
      amount.toString(),
      anchor,
      proof,
      bindingsSignature,
      feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitnesses.map(w => w._rawWitness)
    )
  }

  get inputs (): InputAddressWASM[] {
    return this._rawShieldTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (value: InputAddressWASM[]) {
    this._rawShieldTransition.inputs = value.map(i => i._rawInputAddress)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get amount (): bigint {
    return BigInt(this._rawShieldTransition.amount)
  }

  set amount (value: bigint) {
    this._rawShieldTransition.amount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldTransition.bindingsSignature = value
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawShieldTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (value: AddressFundsFeeStrategyStepWASM[]) {
    this._rawShieldTransition.feeStrategy = value.map(s => s._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawShieldTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawShieldTransition.userFeeIncrease = value
  }

  get inputWitnesses (): AddressWitnessWASM[] {
    return this._rawShieldTransition.inputWitnesses.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitnesses (value: AddressWitnessWASM[]) {
    this._rawShieldTransition.inputWitnesses = value.map(w => w._rawWitness)
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(dppProvider.dpp.ShieldTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldTransitionWASM {
    return ShieldTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ShieldTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldTransitionNAPI): ShieldTransitionWASM {
    const instance: ShieldTransitionWASM = Object.create(ShieldTransitionWASM.prototype)
    instance._rawShieldTransition = rawInstance

    return instance
  }
}