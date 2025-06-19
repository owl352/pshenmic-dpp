const assert = require('assert')
const {describe, it, before} = require('mocha')
const initWasm = require('./utils/wasm')
const {identifier} = require("./mocks/Identity");

let wasm

describe('AuthorizedActionTakers', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('should allows to create AuthorizedActionTakers with NoOne', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.NoOne()

      assert.notEqual(actionTaker.__wbg_ptr, 0)
      assert.deepEqual(actionTaker.getTakerType(), "NoOne")
    })

    it('should allows to create AuthorizedActionTakers with ContractOwner', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.ContractOwner()

      assert.notEqual(actionTaker.__wbg_ptr, 0)
      assert.deepEqual(actionTaker.getTakerType(), "ContractOwner")
    })

    it('should allows to create AuthorizedActionTakers with Identity', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.Identity(identifier)

      assert.notEqual(actionTaker.__wbg_ptr, 0)
      assert.deepEqual(actionTaker.getTakerType(), `Identity(${identifier})`)
    })

    it('should allows to create AuthorizedActionTakers with MainGroup', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.MainGroup()

      assert.notEqual(actionTaker.__wbg_ptr, 0)
      assert.deepEqual(actionTaker.getTakerType(), `MainGroup`)
    })

    it('should allows to create AuthorizedActionTakers with Group', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.Group(12)

      assert.notEqual(actionTaker.__wbg_ptr, 0)
      assert.deepEqual(actionTaker.getTakerType(), `Group(12)`)
    })
  })

  describe('getters', function () {
    it('should allows to get value with NoOne', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.NoOne()

      assert.deepEqual(actionTaker.getValue(), undefined)
    })

    it('should allows to get value with ContractOwner', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.ContractOwner()

      assert.deepEqual(actionTaker.getValue(), undefined)
    })

    it('should allows to get value with Identity', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.Identity(identifier)

      assert.deepEqual(actionTaker.getValue().base58(), identifier)
    })

    it('should allows to get value with MainGroup', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.MainGroup()

      assert.deepEqual(actionTaker.getValue(), undefined)
    })

    it('should allows to get value with Group', function () {
      const actionTaker = wasm.AuthorizedActionTakersWASM.Group(12)

      assert.deepEqual(actionTaker.getValue(), 12)
    })
  })
})
