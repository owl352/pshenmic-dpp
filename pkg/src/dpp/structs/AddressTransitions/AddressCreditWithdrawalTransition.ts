import type { AddressCreditWithdrawalTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { InputAddressWASM } from './entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js'
import { PoolingLike } from '../../types.js'
import { CoreScriptWASM } from '../CoreScript.js'
import { AddressWitnessWASM } from '../PlatformAddress/AddressWitness.js'
import { OutputAddressWASM } from './entities/OutputAddress.js'
import { dppProvider } from '../../provider.js'
import { valueToDynamicValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class AddressCreditWithdrawalTransitionWASM {
  /** @private **/
  _rawAddressCreditWithdrawalTransition: AddressCreditWithdrawalTransitionNAPI

  constructor (
    inputs: InputAddressWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    coreFeePerByte: number,
    pooling: PoolingLike,
    outputScript: CoreScriptWASM,
    userFeeIncrease: number,
    inputWitness: AddressWitnessWASM[],
    output?: OutputAddressWASM
  ) {
    this._rawAddressCreditWithdrawalTransition = new dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI(
      inputs.map(input => input._rawInputAddress),
      feeStrategy.map(step => step._rawAddressFundsFeeStrategyStep),
      coreFeePerByte,
      valueToDynamicValue(pooling),
      outputScript._rawCoreScript,
      userFeeIncrease,
      inputWitness.map(witness => witness._rawWitness),
      output?._rawOutputAddress
    )
  }

  get coreFeePerByte (): number {
    return this._rawAddressCreditWithdrawalTransition.coreFeePerByte
  }

  set coreFeePerByte (value: number) {
    this._rawAddressCreditWithdrawalTransition.coreFeePerByte = value
  }

  get pooling (): string {
    return this._rawAddressCreditWithdrawalTransition.pooling
  }

  set pooling (value: PoolingLike) {
    this._rawAddressCreditWithdrawalTransition.pooling = valueToDynamicValue(value)
  }

  get outputScript (): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(this._rawAddressCreditWithdrawalTransition.outputScript)
  }

  set outputScript (value: CoreScriptWASM) {
    this._rawAddressCreditWithdrawalTransition.outputScript = value._rawCoreScript
  }

  get inputs (): InputAddressWASM[] {
    return this._rawAddressCreditWithdrawalTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (value: InputAddressWASM[]) {
    this._rawAddressCreditWithdrawalTransition.inputs = value.map(input => input._rawInputAddress)
  }

  get output (): OutputAddressWASM | undefined {
    const output = this._rawAddressCreditWithdrawalTransition.output

    if (output != null) {
      return OutputAddressWASM.createFromRawInstance(output)
    }
  }

  set output (value: OutputAddressWASM | undefined) {
    this._rawAddressCreditWithdrawalTransition.output = value?._rawOutputAddress
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawAddressCreditWithdrawalTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (value: AddressFundsFeeStrategyStepWASM[]) {
    this._rawAddressCreditWithdrawalTransition.feeStrategy = value.map(step => step._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawAddressCreditWithdrawalTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawAddressCreditWithdrawalTransition.userFeeIncrease = value
  }

  get inputWitness (): AddressWitnessWASM[] {
    return this._rawAddressCreditWithdrawalTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitness (value: AddressWitnessWASM[]) {
    this._rawAddressCreditWithdrawalTransition.inputWitness = value.map(witness => witness._rawWitness)
  }

  bytes (): Uint8Array {
    return this._rawAddressCreditWithdrawalTransition.bytes()
  }

  hex (): string {
    return this._rawAddressCreditWithdrawalTransition.hex()
  }

  base64 (): string {
    return this._rawAddressCreditWithdrawalTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawAddressCreditWithdrawalTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): AddressCreditWithdrawalTransitionWASM {
    return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): AddressCreditWithdrawalTransitionWASM {
    return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): AddressCreditWithdrawalTransitionWASM {
    return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (st: StateTransitionWASM): AddressCreditWithdrawalTransitionWASM {
    return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: AddressCreditWithdrawalTransitionNAPI): AddressCreditWithdrawalTransitionWASM {
    const instance: AddressCreditWithdrawalTransitionWASM = Object.create(AddressCreditWithdrawalTransitionWASM.prototype)
    instance._rawAddressCreditWithdrawalTransition = rawInstance

    return instance
  }
}
