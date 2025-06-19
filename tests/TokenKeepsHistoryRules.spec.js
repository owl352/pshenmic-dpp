const assert = require('assert')
const {describe, it, before} = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('TokenKeepsHistoryRules', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allow to create TokenKeepsHistoryRules from values', function () {
      const keepHistory = new wasm.TokenKeepsHistoryRulesWASM(
        true,
        true,
        true,
        true,
        true,
        true,
      )

      assert.notEqual(keepHistory.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get values', function () {
      const keepHistory = new wasm.TokenKeepsHistoryRulesWASM(
        true,
        true,
        true,
        true,
        true,
        true,
      )

      assert.equal(keepHistory.keepsTransferHistory, true)
      assert.equal(keepHistory.keepsFreezingHistory, true)
      assert.equal(keepHistory.keepsMintingHistory, true)
      assert.equal(keepHistory.keepsBurningHistory, true)
      assert.equal(keepHistory.keepsDirectPricingHistory, true)
      assert.equal(keepHistory.keepsDirectPurchaseHistory, true)
    })
  })

  describe('setters', function () {
    it('should allow to set values', function () {
      const keepHistory = new wasm.TokenKeepsHistoryRulesWASM(
        true,
        true,
        true,
        true,
        true,
        true,
      )

      keepHistory.keepsTransferHistory = false
      keepHistory.keepsFreezingHistory = false
      keepHistory.keepsMintingHistory = false
      keepHistory.keepsBurningHistory = false
      keepHistory.keepsDirectPricingHistory = false
      keepHistory.keepsDirectPurchaseHistory = false

      assert.equal(keepHistory.keepsTransferHistory, false)
      assert.equal(keepHistory.keepsFreezingHistory, false)
      assert.equal(keepHistory.keepsMintingHistory, false)
      assert.equal(keepHistory.keepsBurningHistory, false)
      assert.equal(keepHistory.keepsDirectPricingHistory, false)
      assert.equal(keepHistory.keepsDirectPurchaseHistory, false)
    })
  })
})
