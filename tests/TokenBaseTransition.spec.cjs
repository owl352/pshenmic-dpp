const assert = require('assert')
const { describe, it } = require('mocha')
const { dataContractId, ownerId } = require('./mocks/Document/index.js')
const { default: wasm } = require('..')

describe('TokenBaseTransition', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create from values', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.notEqual(baseTransition.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get identityContractNonce', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.deepEqual(baseTransition.identityContractNonce, 1n)
    })

    it('should allow to get tokenContractPosition', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.deepEqual(baseTransition.tokenContractPosition, 1)
    })

    it('should allow to get dataContractId', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.deepEqual(baseTransition.dataContractId.base58(), dataContractId)
    })

    it('should allow to get tokenId', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.deepEqual(baseTransition.tokenId.base58(), ownerId)
    })

    it('should allow to get usingGroupInfo', () => {
      const groupStInfo = new wasm.GroupStateTransitionInfoWASM(2, dataContractId, false)

      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId, groupStInfo)

      assert.notEqual(groupStInfo.__wbg_ptr, 0)
      assert.deepEqual(baseTransition.usingGroupInfo.constructor.name, 'GroupStateTransitionInfoWASM')
    })
  })

  describe('setters', function () {
    it('should allow to set identityContractNonce', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      baseTransition.identityContractNonce = 3n

      assert.deepEqual(baseTransition.identityContractNonce, 3n)
    })

    it('should allow to set tokenContractPosition', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      baseTransition.tokenContractPosition = 3

      assert.deepEqual(baseTransition.tokenContractPosition, 3)
    })

    it('should allow to set dataContractId', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      baseTransition.dataContractId = ownerId

      assert.deepEqual(baseTransition.dataContractId.base58(), ownerId)
    })

    it('should allow to set tokenId', () => {
      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      baseTransition.tokenId = dataContractId

      assert.deepEqual(baseTransition.tokenId.base58(), dataContractId)
    })

    it('should allow to set usingGroupInfo', () => {
      const groupStInfo = new wasm.GroupStateTransitionInfoWASM(2, dataContractId, false)

      const baseTransition = new wasm.TokenBaseTransitionWASM(BigInt(1), 1, dataContractId, ownerId)

      assert.deepEqual(baseTransition.usingGroupInfo, undefined)

      baseTransition.usingGroupInfo = groupStInfo

      assert.notEqual(groupStInfo.__wbg_ptr, 0)
      assert.deepEqual(baseTransition.usingGroupInfo.constructor.name, 'GroupStateTransitionInfoWASM')
    })
  })
})
