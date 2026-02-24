import type { AddressFundsTransferTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { InputAddressWASM } from './entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js'
import { AddressWitnessWASM } from '../Address/AddressWitness.js'
import { OutputAddressWASM } from './entities/OutputAddress.js'
import { dppProvider } from '../../provider.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class AddressFundsTransferTransitionWASM {
  /** @private **/
  _rawAddressFundsTransferTransition: AddressFundsTransferTransitionNAPI

  constructor (
    inputs: InputAddressWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitness: AddressWitnessWASM[],
    outputs: OutputAddressWASM[]
  ) {
    this._rawAddressFundsTransferTransition = new dppProvider.dpp.AddressFundsTransferTransitionNAPI(
      inputs.map(i => i._rawInputAddress),
      feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitness.map(w => w._rawWitness),
      outputs.map(o => o._rawOutputAddress)
    )
  }

  get inputs (): InputAddressWASM[] {
    return this._rawAddressFundsTransferTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (inputs: InputAddressWASM[]) {
    this._rawAddressFundsTransferTransition.inputs = inputs.map(i => i._rawInputAddress)
  }

  get outputs (): OutputAddressWASM[] {
    return this._rawAddressFundsTransferTransition.outputs.map(OutputAddressWASM.createFromRawInstance)
  }

  set outputs (outputs: OutputAddressWASM[]) {
    this._rawAddressFundsTransferTransition.outputs = outputs.map(o => o._rawOutputAddress)
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawAddressFundsTransferTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (feeStrategy: AddressFundsFeeStrategyStepWASM[]) {
    this._rawAddressFundsTransferTransition.feeStrategy = feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawAddressFundsTransferTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawAddressFundsTransferTransition.userFeeIncrease = value
  }

  get inputWitness (): AddressWitnessWASM[] {
    return this._rawAddressFundsTransferTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitness (witness: AddressWitnessWASM[]) {
    this._rawAddressFundsTransferTransition.inputWitness = witness.map(w => w._rawWitness)
  }

  bytes (): Uint8Array {
    return this._rawAddressFundsTransferTransition.bytes()
  }

  hex (): string {
    return this._rawAddressFundsTransferTransition.hex()
  }

  base64 (): string {
    return this._rawAddressFundsTransferTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawAddressFundsTransferTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): AddressFundsTransferTransitionWASM {
    return AddressFundsTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): AddressFundsTransferTransitionWASM {
    return AddressFundsTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): AddressFundsTransferTransitionWASM {
    return AddressFundsTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): AddressFundsTransferTransitionWASM {
    return AddressFundsTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: AddressFundsTransferTransitionNAPI): AddressFundsTransferTransitionWASM {
    const instance = Object.create(AddressFundsTransferTransitionWASM.prototype)
    instance._rawAddressFundsTransferTransition = rawInstance

    return instance
  }
}
