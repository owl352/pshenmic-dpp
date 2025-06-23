const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('IdentityCreateTransition', function () {
  describe('serialization / deserialization', function () {
    it('should allow to create transition', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.notEqual(transition.__wbg_ptr, 0)
    })

    it('should allow to serialize to bytes', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      const bytes = transition.bytes()

      assert.equal(bytes.length > 0, true)
    })

    it('should allow to deserialize to bytes', function () {
      const bytes = [0, 0, 0, 162, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 255, 255, 255, 255, 1, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      const transition = wasm.IdentityCreateTransitionWASM.fromBytes(bytes)

      assert.notEqual(transition.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('should allow to get userFeeIncrease', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.equal(transition.userFeeIncrease, 0)
    })

    it('should allow to get AssetLock', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.notEqual(transition.assetLock.__wbg_ptr, 0)
    })

    it('should allow to get Identifier', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.equal(transition.getIdentifier().base58(), '11111111111111111111111111111111')
    })

    it('should allow to get PublicKeys', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.equal(transition.publicKeys.length, 0)
    })

    it('should allow to get signature', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.deepEqual(transition.getSignature(), Uint8Array.from([]))
    })

    it('should allow to get signable bytes', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      assert.equal(transition.getSignableBytes().length, 229)
    })
  })

  describe('setters', function () {
    it('should allow to set the userFeeIncrease', function () {
      const transition = wasm.IdentityCreateTransitionWASM.default(0)

      transition.userFeeIncrease = 100

      assert.equal(transition.userFeeIncrease, 100)
    })

    // TODO: Implement publickeys in creation setter
    // it('should allow to set the publicKeys', function () {
    //
    // })

    // TODO: Implement asset lock setter
    // it('should allow to set the asset lock', function () {
    //
    // })
  })
})
