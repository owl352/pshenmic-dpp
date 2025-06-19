const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('TokenPreProgrammedDistribution', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
          }
        }
      )

      assert.notEqual(preProgrammedDistribution.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get distributions', () => {
      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10100)
          }
        }
      )

      assert.deepEqual(preProgrammedDistribution.distributions, {
        1750140416485: {
          PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10100)
        }
      })
    })
  })

  describe('setters', function () {
    it('should allow to set distributions', () => {
      const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
        {
          1750140416485: {
            PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10100)
          }
        }
      )

      preProgrammedDistribution.distributions = {
        1750140416415: {
          PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(9999999)
        }
      }

      assert.deepEqual(preProgrammedDistribution.distributions, {
        1750140416415: {
          PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(9999999)
        }
      })
    })
  })
})
