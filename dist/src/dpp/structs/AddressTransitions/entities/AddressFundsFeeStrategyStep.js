import { dppProvider } from '../../../provider.js';
export class AddressFundsFeeStrategyStepWASM {
    /** @private **/
    _rawAddressFundsFeeStrategyStep;
    constructor(addressFundsFeeStrategyStep) {
        this._rawAddressFundsFeeStrategyStep = addressFundsFeeStrategyStep;
    }
    getValue() {
        return this._rawAddressFundsFeeStrategyStep.getValue();
    }
    setValue(value) {
        this._rawAddressFundsFeeStrategyStep.setValue(value);
    }
    getValueType() {
        return this._rawAddressFundsFeeStrategyStep.getValueType();
    }
    static DeductFromInput(input) {
        return new AddressFundsFeeStrategyStepWASM(dppProvider.dpp.AddressFundsFeeStrategyStepNAPI.DeductFromInput(input));
    }
    static ReduceOutput(output) {
        return new AddressFundsFeeStrategyStepWASM(dppProvider.dpp.AddressFundsFeeStrategyStepNAPI.ReduceOutput(output));
    }
    static createFromRawInstance(rawInstance) {
        return new AddressFundsFeeStrategyStepWASM(rawInstance);
    }
}
