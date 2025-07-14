const assert = require('assert')
const { describe, it } = require('mocha')
const { identifier } = require('./mocks/Identity')
const { default: wasm } = require('..')

describe('TokenDistributionRecipient', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create from values ContractOwner', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      assert.notEqual(recipient.__wbg_ptr, 0)
    })

    it('should allow to create from values Identity', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.Identity(identifier)

      assert.notEqual(recipient.__wbg_ptr, 0)
    })

    it('should allow to create from values EvonodesByParticipation', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.EvonodesByParticipation()

      assert.notEqual(recipient.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get values ContractOwner', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.ContractOwner()

      assert.equal(recipient.getType(), 'ContractOwner')
      assert.equal(recipient.getValue(), undefined)
    })

    it('should allow to get values Identity', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.Identity(identifier)

      assert.equal(recipient.getType(), `Identity(${identifier})`)
      assert.equal(recipient.getValue().base58(), identifier)
    })

    it('should allow to get values EvonodesByParticipation', () => {
      const recipient = wasm.TokenDistributionRecipientWASM.EvonodesByParticipation()

      assert.equal(recipient.getType(), 'EvonodesByParticipation')
      assert.equal(recipient.getValue(), undefined)
    })
  })
})
