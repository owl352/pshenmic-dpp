import type { IdentityCreateFromAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { InputAddressWASM } from './entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js'
import { AddressWitnessWASM } from '../Address/AddressWitness.js'
import { OutputAddressWASM } from './entities/OutputAddress.js'
import { dppProvider } from '../../provider.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreateFromAddressesTransitionWASM {
  /** @private **/
  _rawIdentityCreateFromAddressesTransition: IdentityCreateFromAddressesTransitionNAPI

  constructor (
    identityPublicKeysInCreation: IdentityPublicKeyInCreationWASM[],
    inputs: InputAddressWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitness: AddressWitnessWASM[],
    output?: OutputAddressWASM
  ) {
    this._rawIdentityCreateFromAddressesTransition = new dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI(
      identityPublicKeysInCreation.map(k => k._rawKeyInCreation),
      inputs.map(i => i._rawInputAddress),
      feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitness.map(w => w._rawWitness),
      output?._rawOutputAddress
    )
  }

  get publicKeys (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityCreateFromAddressesTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance)
  }

  set publicKeys (publicKeys: IdentityPublicKeyInCreationWASM[]) {
    this._rawIdentityCreateFromAddressesTransition.publicKeys = publicKeys.map(k => k._rawKeyInCreation)
  }

  get inputs (): InputAddressWASM[] {
    return this._rawIdentityCreateFromAddressesTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (inputs: InputAddressWASM[]) {
    this._rawIdentityCreateFromAddressesTransition.inputs = inputs.map(i => i._rawInputAddress)
  }

  get output (): OutputAddressWASM | undefined {
    const output = this._rawIdentityCreateFromAddressesTransition.output

    if (output != null) {
      return OutputAddressWASM.createFromRawInstance(output)
    }
  }

  set output (output: OutputAddressWASM | undefined) {
    this._rawIdentityCreateFromAddressesTransition.output = output?._rawOutputAddress
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawIdentityCreateFromAddressesTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (feeStrategy: AddressFundsFeeStrategyStepWASM[]) {
    this._rawIdentityCreateFromAddressesTransition.feeStrategy = feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawIdentityCreateFromAddressesTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityCreateFromAddressesTransition.userFeeIncrease = value
  }

  get inputWitness (): AddressWitnessWASM[] {
    return this._rawIdentityCreateFromAddressesTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitness (value: AddressWitnessWASM[]) {
    this._rawIdentityCreateFromAddressesTransition.inputWitness = value.map(w => w._rawWitness)
  }

  bytes (): Uint8Array {
    return this._rawIdentityCreateFromAddressesTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityCreateFromAddressesTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityCreateFromAddressesTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreateFromAddressesTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityCreateFromAddressesTransitionWASM {
    return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityCreateFromAddressesTransitionWASM {
    return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityCreateFromAddressesTransitionWASM {
    return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityCreateFromAddressesTransitionWASM {
    return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreateFromAddressesTransitionNAPI): IdentityCreateFromAddressesTransitionWASM {
    const instance = Object.create(IdentityCreateFromAddressesTransitionWASM.prototype)
    instance._rawIdentityCreateFromAddressesTransition = rawInstance

    return instance
  }
}
