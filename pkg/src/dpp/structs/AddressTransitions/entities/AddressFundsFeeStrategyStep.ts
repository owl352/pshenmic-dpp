import type { AddressFundsFeeStrategyStepNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../provider.js'

export class AddressFundsFeeStrategyStepWASM {
  /** @private **/
  _rawAddressFundsFeeStrategyStep: AddressFundsFeeStrategyStepNAPI

  private constructor (addressFundsFeeStrategyStep: AddressFundsFeeStrategyStepNAPI) {
    this._rawAddressFundsFeeStrategyStep = addressFundsFeeStrategyStep
  }

  getValue (): number {
    return this._rawAddressFundsFeeStrategyStep.getValue()
  }

  setValue (value: number): void {
    this._rawAddressFundsFeeStrategyStep.setValue(value)
  }

  getValueType (): string {
    return this._rawAddressFundsFeeStrategyStep.getValueType()
  }

  static DeductFromInput (input: number): AddressFundsFeeStrategyStepWASM {
    return new AddressFundsFeeStrategyStepWASM(dppProvider.dpp.AddressFundsFeeStrategyStepNAPI.DeductFromInput(input))
  }

  static ReduceOutput (output: number): AddressFundsFeeStrategyStepWASM {
    return new AddressFundsFeeStrategyStepWASM(dppProvider.dpp.AddressFundsFeeStrategyStepNAPI.ReduceOutput(output))
  }

  static createFromRawInstance (rawInstance: AddressFundsFeeStrategyStepNAPI): AddressFundsFeeStrategyStepWASM {
    return new AddressFundsFeeStrategyStepWASM(rawInstance)
  }
}
