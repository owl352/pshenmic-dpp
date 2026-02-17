import { IdentityTopUpFromAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike } from '../../types.js'
import { InputAddressWASM } from './entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js'
import { AddressWitnessWASM } from '../Address/AddressWitness.js'
import { OutputAddressWASM } from './entities/OutputAddress.js'
import { prepareIdentifierValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityTopUpFromAddressesTransitionWASM {
  /** @private **/
  _rawIdentityTopUpFromAddressesTransition: IdentityTopUpFromAddressesTransitionNAPI

  constructor (
    identifier: IdentifierLike,
    inputs: InputAddressWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitness: AddressWitnessWASM[],
    output?: OutputAddressWASM
  ) {
    this._rawIdentityTopUpFromAddressesTransition = new dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI(
      prepareIdentifierValue(identifier),
      inputs.map(i => i._rawInputAddress),
      feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitness.map(w => w._rawWitness),
      output?._rawOutputAddress
    )
  }

  get inputs (): InputAddressWASM[] {
    return this._rawIdentityTopUpFromAddressesTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (inputs: InputAddressWASM[]) {
    this._rawIdentityTopUpFromAddressesTransition.inputs = inputs.map(i => i._rawInputAddress)
  }

  get output (): OutputAddressWASM | undefined {
    const output = this._rawIdentityTopUpFromAddressesTransition.output

    if (output != null) {
      return OutputAddressWASM.createFromRawInstance(output)
    }
  }

  set output (output: OutputAddressWASM | undefined) {
    this._rawIdentityTopUpFromAddressesTransition.output = output?._rawOutputAddress
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawIdentityTopUpFromAddressesTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (feeStrategy: AddressFundsFeeStrategyStepWASM[]) {
    this._rawIdentityTopUpFromAddressesTransition.feeStrategy = feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawIdentityTopUpFromAddressesTransition.userFeeIncrease
  }

  set userFeeIncrease (userFeeIncrease: number) {
    this._rawIdentityTopUpFromAddressesTransition.userFeeIncrease = userFeeIncrease
  }

  get inputWitness (): AddressWitnessWASM[] {
    return this._rawIdentityTopUpFromAddressesTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitness (addressWitness: AddressWitnessWASM[]) {
    this._rawIdentityTopUpFromAddressesTransition.inputWitness = addressWitness.map(w => w._rawWitness)
  }

  bytes (): Uint8Array {
    return this._rawIdentityTopUpFromAddressesTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityTopUpFromAddressesTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityTopUpFromAddressesTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityTopUpFromAddressesTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityTopUpFromAddressesTransitionWASM {
    return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityTopUpFromAddressesTransitionWASM {
    return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityTopUpFromAddressesTransitionWASM {
    return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityTopUpFromAddressesTransitionWASM {
    return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityTopUpFromAddressesTransitionNAPI): IdentityTopUpFromAddressesTransitionWASM {
    const instance: IdentityTopUpFromAddressesTransitionWASM = Object.create(this.prototype)
    instance._rawIdentityTopUpFromAddressesTransition = rawInstance

    return instance
  }
}
