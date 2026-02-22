import { AddressFundingFromAssetLockTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { InputAddressWASM } from './entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js'
import { AddressWitnessWASM } from '../Address/AddressWitness.js'
import { OutputAddressNullableCreditsWASM } from './entities/OutputAddressNullableCredits.js'
import { dppProvider } from '../../provider.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class AddressFundingFromAssetLockTransitionWASM {
  /** @private **/
  _rawAddressFundingFromAssetLockTransition: AddressFundingFromAssetLockTransitionNAPI

  constructor (
    assetLockProof: AssetLockProofWASM,
    inputs: InputAddressWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitness: AddressWitnessWASM[],
    outputs: OutputAddressNullableCreditsWASM[]
  ) {
    this._rawAddressFundingFromAssetLockTransition = new dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI(
      assetLockProof._rawAssetLockProof,
      inputs.map(i => i._rawInputAddress),
      feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitness.map(i => i._rawWitness),
      outputs.map(o => o._rawOutputAddressNullableCredits)
    )
  }

  get assetLockProof (): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(this._rawAddressFundingFromAssetLockTransition.assetLockProof)
  }

  set assetLockProof (assetLockProof: AssetLockProofWASM) {
    this._rawAddressFundingFromAssetLockTransition.assetLockProof = assetLockProof._rawAssetLockProof
  }

  get inputs (): InputAddressWASM[] {
    return this._rawAddressFundingFromAssetLockTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (inputs: InputAddressWASM[]) {
    this._rawAddressFundingFromAssetLockTransition.inputs = inputs.map(i => i._rawInputAddress)
  }

  get outputs (): OutputAddressNullableCreditsWASM[] {
    return this._rawAddressFundingFromAssetLockTransition.outputs.map(OutputAddressNullableCreditsWASM.createFromRawInstance)
  }

  set outputs (outputs: OutputAddressNullableCreditsWASM[]) {
    this._rawAddressFundingFromAssetLockTransition.outputs = outputs.map(o => o._rawOutputAddressNullableCredits)
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawAddressFundingFromAssetLockTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (feeStrategy: AddressFundsFeeStrategyStepWASM[]) {
    this._rawAddressFundingFromAssetLockTransition.feeStrategy = feeStrategy.map(step => step._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawAddressFundingFromAssetLockTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawAddressFundingFromAssetLockTransition.userFeeIncrease = value
  }

  get inputWitness (): AddressWitnessWASM[] {
    return this._rawAddressFundingFromAssetLockTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitness (value: AddressWitnessWASM[]) {
    this._rawAddressFundingFromAssetLockTransition.inputWitness = value.map(w => w._rawWitness)
  }

  get signature (): Uint8Array {
    return this._rawAddressFundingFromAssetLockTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawAddressFundingFromAssetLockTransition.signature = value
  }

  bytes (): Uint8Array {
    return this._rawAddressFundingFromAssetLockTransition.bytes()
  }

  hex (): string {
    return this._rawAddressFundingFromAssetLockTransition.hex()
  }

  base64 (): string {
    return this._rawAddressFundingFromAssetLockTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawAddressFundingFromAssetLockTransition.toStateTransition())
  }

  static fromBytes (bytes: Uint8Array): AddressFundingFromAssetLockTransitionWASM {
    return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): AddressFundingFromAssetLockTransitionWASM {
    return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): AddressFundingFromAssetLockTransitionWASM {
    return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): AddressFundingFromAssetLockTransitionWASM {
    return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: AddressFundingFromAssetLockTransitionNAPI): AddressFundingFromAssetLockTransitionWASM {
    const instance = Object.create(this.prototype)
    instance._rawAddressFundingFromAssetLockTransitionNAPI = rawInstance

    return instance
  }
}
