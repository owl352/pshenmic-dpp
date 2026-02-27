import type { AddressFundsFeeStrategyStepNAPI } from '../../../../../binaries/bindingsTypes.js';
export declare class AddressFundsFeeStrategyStepWASM {
    /** @private **/
    _rawAddressFundsFeeStrategyStep: AddressFundsFeeStrategyStepNAPI;
    private constructor();
    getValue(): number;
    setValue(value: number): void;
    getValueType(): string;
    static DeductFromInput(input: number): AddressFundsFeeStrategyStepWASM;
    static ReduceOutput(output: number): AddressFundsFeeStrategyStepWASM;
    static createFromRawInstance(rawInstance: AddressFundsFeeStrategyStepNAPI): AddressFundsFeeStrategyStepWASM;
}
