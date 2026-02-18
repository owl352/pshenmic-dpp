import { DistributionFunctionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import {
  DistributionExponential,
  DistributionFixedAmount, DistributionInvertedLogarithmic,
  DistributionLinear, DistributionLogarithmic, DistributionPolynomial,
  DistributionRandom,
  DistributionStepDecreasingAmount, DistributionStepwise
} from '../../types.js'

export class DistributionFunctionWASM {
  /** @private **/
  _rawDistributionFunction: DistributionFunctionNAPI

  private constructor (rawInstance: DistributionFunctionNAPI) {
    this._rawDistributionFunction = rawInstance
  }

  static FixedAmountDistribution (amount: bigint): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.FixedAmountDistribution(amount.toString())
    )
  }

  getFunctionName (): string {
    return this._rawDistributionFunction.getFunctionName()
  }

  getFunctionValue (): DistributionFixedAmount | DistributionRandom | DistributionStepDecreasingAmount | DistributionLinear | DistributionPolynomial | DistributionExponential | DistributionLogarithmic | DistributionInvertedLogarithmic | DistributionStepwise {
    const value = this._rawDistributionFunction.getFunctionValue()
    if (Array.isArray(value)) {
      // StepWise
      return value.map(step => ({
        step: BigInt(step.step),
        amount: BigInt(step.amount)
      }))
    } else {
      return value
    }
  }

  static Random (min: bigint, max: bigint): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Random(min.toString(), max.toString())
    )
  }

  static StepDecreasingAmount (
    stepCount: number,
    decreasePerIntervalNumerator: number,
    decreasePerIntervalDenominator: number,
    distributionStartAmount: bigint,
    trailingDistributionIntervalAmount: bigint,
    startDecreasingOffset?: bigint,
    maxIntervalCount?: number,
    minValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.StepDecreasingAmount(
        stepCount,
        decreasePerIntervalNumerator,
        decreasePerIntervalDenominator,
        startDecreasingOffset?.toString(),
        maxIntervalCount,
        distributionStartAmount?.toString(),
        trailingDistributionIntervalAmount?.toString(),
        minValue?.toString()
      )
    )
  }

  static Stepwise (steps: DistributionStepwise): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Stepwise(
        steps.map((step) => ({
          step: step.step.toString(),
          amount: step.amount.toString()
        }))
      )
    )
  }

  static Linear (
    a: number,
    d: bigint,
    startingAmount: bigint,
    startStep?: bigint,
    minValue?: bigint,
    maxValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Linear(
        a,
        d.toString(),
        startStep?.toString(),
        startingAmount.toString(),
        minValue?.toString(),
        maxValue?.toString()
      )
    )
  }

  static Polynomial (
    a: number,
    d: bigint,
    m: number,
    n: bigint,
    o: number,
    b: bigint,
    startMoment?: bigint,
    minValue?: bigint,
    maxValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Polynomial(
        a,
        d.toString(),
        m,
        n.toString(),
        o,
        startMoment?.toString(),
        b.toString(),
        minValue?.toString(),
        maxValue?.toString()
      )
    )
  }

  static Exponential (
    a: bigint,
    d: bigint,
    m: number,
    n: bigint,
    o: number,
    b: bigint,
    startMoment?: bigint,
    minValue?: bigint,
    maxValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Exponential(
        a.toString(),
        d.toString(),
        m,
        n.toString(),
        o,
        startMoment?.toString(),
        b.toString(),
        minValue?.toString(),
        maxValue?.toString()
      )
    )
  }

  static Logarithmic (
    a: number,
    d: bigint,
    m: bigint,
    n: bigint,
    o: number,
    b: bigint,
    startMoment?: bigint,
    minValue?: bigint,
    maxValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.Logarithmic(
        a,
        d.toString(),
        m.toString(),
        n.toString(),
        o,
        startMoment?.toString(),
        b.toString(),
        minValue?.toString(),
        maxValue?.toString()
      )
    )
  }

  static InvertedLogarithmic (
    a: number,
    d: bigint,
    m: bigint,
    n: bigint,
    o: number,
    b: bigint,
    startMoment?: bigint,
    minValue?: bigint,
    maxValue?: bigint
  ): DistributionFunctionWASM {
    return new DistributionFunctionWASM(
      dppProvider.dpp.DistributionFunctionNAPI.InvertedLogarithmic(
        a,
        d.toString(),
        m.toString(),
        n.toString(),
        o,
        startMoment?.toString(),
        b.toString(),
        minValue?.toString(),
        maxValue?.toString()
      )
    )
  }

  static createFromRawInstance (rawInstance: DistributionFunctionNAPI): DistributionFunctionWASM {
    return new DistributionFunctionWASM(rawInstance)
  }
}
