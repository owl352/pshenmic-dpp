import { dppProvider } from '../../provider.js';
export class DistributionFunctionWASM {
    /** @private **/
    _rawDistributionFunction;
    constructor(rawInstance) {
        this._rawDistributionFunction = rawInstance;
    }
    static FixedAmountDistribution(amount) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.FixedAmountDistribution(amount.toString()));
    }
    getFunctionName() {
        return this._rawDistributionFunction.getFunctionName();
    }
    getFunctionValue() {
        const value = this._rawDistributionFunction.getFunctionValue();
        if (Array.isArray(value)) {
            // StepWise
            return value.map(step => ({
                step: BigInt(step.step),
                amount: BigInt(step.amount)
            }));
        }
        else {
            return value;
        }
    }
    static Random(min, max) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Random(min.toString(), max.toString()));
    }
    static StepDecreasingAmount(stepCount, decreasePerIntervalNumerator, decreasePerIntervalDenominator, distributionStartAmount, trailingDistributionIntervalAmount, startDecreasingOffset, maxIntervalCount, minValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.StepDecreasingAmount(stepCount, decreasePerIntervalNumerator, decreasePerIntervalDenominator, startDecreasingOffset?.toString(), maxIntervalCount, distributionStartAmount?.toString(), trailingDistributionIntervalAmount?.toString(), minValue?.toString()));
    }
    static Stepwise(steps) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Stepwise(steps.map((step) => ({
            step: step.step.toString(),
            amount: step.amount.toString()
        }))));
    }
    static Linear(a, d, startingAmount, startStep, minValue, maxValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Linear(a, d.toString(), startStep?.toString(), startingAmount.toString(), minValue?.toString(), maxValue?.toString()));
    }
    static Polynomial(a, d, m, n, o, b, startMoment, minValue, maxValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Polynomial(a, d.toString(), m, n.toString(), o, startMoment?.toString(), b.toString(), minValue?.toString(), maxValue?.toString()));
    }
    static Exponential(a, d, m, n, o, b, startMoment, minValue, maxValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Exponential(a.toString(), d.toString(), m, n.toString(), o, startMoment?.toString(), b.toString(), minValue?.toString(), maxValue?.toString()));
    }
    static Logarithmic(a, d, m, n, o, b, startMoment, minValue, maxValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.Logarithmic(a, d.toString(), m.toString(), n.toString(), o, startMoment?.toString(), b.toString(), minValue?.toString(), maxValue?.toString()));
    }
    static InvertedLogarithmic(a, d, m, n, o, b, startMoment, minValue, maxValue) {
        return new DistributionFunctionWASM(dppProvider.dpp.DistributionFunctionNAPI.InvertedLogarithmic(a, d.toString(), m.toString(), n.toString(), o, startMoment?.toString(), b.toString(), minValue?.toString(), maxValue?.toString()));
    }
    static createFromRawInstance(rawInstance) {
        return new DistributionFunctionWASM(rawInstance);
    }
}
