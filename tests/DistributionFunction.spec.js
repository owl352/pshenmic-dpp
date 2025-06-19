const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('DistributionFunction', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('shoulda allow to create FixedAmountDistribution', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
        BigInt(111)
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Random', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Random(
        BigInt(111),
        BigInt(113)
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create StepDecreasingAmount', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.StepDecreasingAmount(
        11,
        11,
        11,
        undefined,
        undefined,
        BigInt(111),
        BigInt(113),
        BigInt(1)
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Stepwise', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Stepwise(
        {
          11111111121: BigInt(111)
        }
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Linear', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Linear(
        BigInt(111),
        BigInt(113),
        undefined,
        BigInt(113),
        undefined,
        undefined
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Polynomial', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Polynomial(
        BigInt(111),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        undefined,
        BigInt(113),
        undefined,
        undefined
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Exponential', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Exponential(
        BigInt(111),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        undefined,
        BigInt(113),
        undefined,
        undefined
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create Logarithmic', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.Logarithmic(
        BigInt(111),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        undefined,
        BigInt(113),
        undefined,
        undefined
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })

    it('shoulda allow to create InvertedLogarithmic', () => {
      const distributionFunction = wasm.DistributionFunctionWASM.InvertedLogarithmic(
        BigInt(111),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        BigInt(113),
        undefined,
        BigInt(113),
        undefined,
        undefined
      )

      assert.notEqual(distributionFunction.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    describe('function name', function () {
      it('FixedAmountDistribution', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
          BigInt(111)
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'FixedAmount')
      })

      it('Random', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Random(
          BigInt(111),
          BigInt(113)
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Random')
      })

      it('StepDecreasingAmount', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.StepDecreasingAmount(
          11,
          11,
          11,
          undefined,
          undefined,
          BigInt(111),
          BigInt(113),
          BigInt(1)
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'StepDecreasingAmount')
      })

      it('Stepwise', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Stepwise(
          {
            11111111121: BigInt(111)
          }
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Stepwise')
      })

      it('Linear', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Linear(
          BigInt(111),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Linear')
      })

      it('Polynomial', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Polynomial(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Polynomial')
      })

      it('Exponential', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Exponential(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Exponential')
      })

      it('Logarithmic', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Logarithmic(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'Logarithmic')
      })

      it('InvertedLogarithmic', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.InvertedLogarithmic(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionName(), 'InvertedLogarithmic')
      })
    })
    describe('function value', function () {
      it('FixedAmountDistribution', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.FixedAmountDistribution(
          BigInt(111)
        )

        assert.deepEqual(distributionFunction.getFunctionValue().amount, 111n)
      })

      it('Random', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Random(
          BigInt(111),
          BigInt(113)
        )

        assert.deepEqual(distributionFunction.getFunctionValue().min, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().max, 113n)
      })

      it('StepDecreasingAmount', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.StepDecreasingAmount(
          11,
          11,
          11,
          undefined,
          undefined,
          BigInt(111),
          BigInt(113),
          BigInt(1)
        )

        assert.deepEqual(distributionFunction.getFunctionValue().stepCount, 11)
        assert.deepEqual(distributionFunction.getFunctionValue().decreasePerIntervalNumerator, 11)
        assert.deepEqual(distributionFunction.getFunctionValue().decreasePerIntervalDenominator, 11)
        assert.deepEqual(distributionFunction.getFunctionValue().startDecreasingOffset, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxIntervalCount, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().distributionStartAmount, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().trailingDistributionIntervalAmount, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, 1n)
      })

      it('Stepwise', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Stepwise(
          {
            11111111121: BigInt(111)
          }
        )

        assert.deepEqual(distributionFunction.getFunctionValue(), {
          11111111121: BigInt(111)
        })
      })

      it('Linear', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Linear(
          BigInt(111),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionValue().a, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().d, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().startStep, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().startingAmount, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxValue, undefined)
      })

      it('Polynomial', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Polynomial(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionValue().a, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().d, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().m, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().n, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().o, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().startMoment, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().b, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxValue, undefined)
      })

      it('Exponential', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Exponential(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionValue().a, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().d, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().m, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().n, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().o, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().startMoment, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().b, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxValue, undefined)
      })

      it('Logarithmic', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.Logarithmic(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionValue().a, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().d, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().m, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().n, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().o, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().startMoment, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().b, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxValue, undefined)
      })

      it('InvertedLogarithmic', () => {
        const distributionFunction = wasm.DistributionFunctionWASM.InvertedLogarithmic(
          BigInt(111),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          BigInt(113),
          undefined,
          BigInt(113),
          undefined,
          undefined
        )

        assert.deepEqual(distributionFunction.getFunctionValue().a, 111n)
        assert.deepEqual(distributionFunction.getFunctionValue().d, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().m, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().n, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().o, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().startMoment, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().b, 113n)
        assert.deepEqual(distributionFunction.getFunctionValue().minValue, undefined)
        assert.deepEqual(distributionFunction.getFunctionValue().maxValue, undefined)
      })
    })
  })
})
