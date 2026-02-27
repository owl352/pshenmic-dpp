import type { DistributionFunctionNAPI } from '../../../../binaries/bindingsTypes.js';
import { DistributionExponential, DistributionFixedAmount, DistributionInvertedLogarithmic, DistributionLinear, DistributionLogarithmic, DistributionPolynomial, DistributionRandom, DistributionStepDecreasingAmount, DistributionStepwise } from '../../types.js';
export declare class DistributionFunctionWASM {
    /** @private **/
    _rawDistributionFunction: DistributionFunctionNAPI;
    private constructor();
    static FixedAmountDistribution(amount: bigint): DistributionFunctionWASM;
    getFunctionName(): string;
    getFunctionValue(): DistributionFixedAmount | DistributionRandom | DistributionStepDecreasingAmount | DistributionLinear | DistributionPolynomial | DistributionExponential | DistributionLogarithmic | DistributionInvertedLogarithmic | DistributionStepwise;
    static Random(min: bigint, max: bigint): DistributionFunctionWASM;
    static StepDecreasingAmount(stepCount: number, decreasePerIntervalNumerator: number, decreasePerIntervalDenominator: number, distributionStartAmount: bigint, trailingDistributionIntervalAmount: bigint, startDecreasingOffset?: bigint, maxIntervalCount?: number, minValue?: bigint): DistributionFunctionWASM;
    static Stepwise(steps: DistributionStepwise): DistributionFunctionWASM;
    static Linear(a: number, d: bigint, startingAmount: bigint, startStep?: bigint, minValue?: bigint, maxValue?: bigint): DistributionFunctionWASM;
    static Polynomial(a: number, d: bigint, m: number, n: bigint, o: number, b: bigint, startMoment?: bigint, minValue?: bigint, maxValue?: bigint): DistributionFunctionWASM;
    static Exponential(a: bigint, d: bigint, m: number, n: bigint, o: number, b: bigint, startMoment?: bigint, minValue?: bigint, maxValue?: bigint): DistributionFunctionWASM;
    static Logarithmic(a: number, d: bigint, m: bigint, n: bigint, o: number, b: bigint, startMoment?: bigint, minValue?: bigint, maxValue?: bigint): DistributionFunctionWASM;
    static InvertedLogarithmic(a: number, d: bigint, m: bigint, n: bigint, o: number, b: bigint, startMoment?: bigint, minValue?: bigint, maxValue?: bigint): DistributionFunctionWASM;
    static createFromRawInstance(rawInstance: DistributionFunctionNAPI): DistributionFunctionWASM;
}
