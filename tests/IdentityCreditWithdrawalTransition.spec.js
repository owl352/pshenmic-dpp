const assert = require('assert')
const { describe, it, before } = require('mocha')
const initWasm = require('./utils/wasm')

let wasm

describe('IdentityCreditWithdrawalTransition', function () {
  before(async function () {
    wasm = initWasm()
  })

  describe('serialization / deserialization', function () {
    it('Should allow to create IdentityCreditWithdrawalTransition', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.notEqual(identifier.__wbg_ptr, 0)
      assert.notEqual(script.__wbg_ptr, 0)
      assert.notEqual(transition.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('Should allow to get outputScript', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.outputScript.toString(), 'dqkUAQEBAQEBAQEBAQEBAQEBAQEBAQGIrA==')
    })

    it('Should allow to get pooling', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.pooling, 'Never')
    })

    it('Should allow to get identityId', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.identityId.base58(), identifier.base58())
    })

    it('Should allow to get userFeeIncrease', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.userFeeIncrease, 1)
    })

    it('Should allow to get nonce', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.nonce, BigInt(1))
    })

    it('Should allow to get amount', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.amount, BigInt(111))
    })

    it('Should allow to get signature', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.signature, Uint8Array.from([]))
    })

    it('Should allow to get signaturePublicKeyId', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      assert.deepEqual(transition.signaturePublicKeyId, 0)
    })
  })

  describe('setters', function () {
    it('Should allow to set outputScript', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      const script2 = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      transition.outputScript = script2

      assert.deepEqual(transition.outputScript.toString(), script2.toString())
    })

    it('Should allow to set pooling', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.pooling = 'Standard'

      assert.deepEqual(transition.pooling, 'Standard')
    })

    it('Should allow to set identityId', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      const identifier2 = new wasm.IdentifierWASM('11SAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

      transition.identityId = identifier2

      assert.deepEqual(transition.identityId.base58(), identifier2.base58())
    })

    it('Should allow to set userFeeIncrease', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.userFeeIncrease = 999

      assert.deepEqual(transition.userFeeIncrease, 999)
    })

    it('Should allow to set nonce', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.nonce = BigInt(1111)

      assert.deepEqual(transition.nonce, BigInt(1111))
    })

    it('Should allow to get amount', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.amount = BigInt(2222)

      assert.deepEqual(transition.amount, BigInt(2222))
    })

    it('Should allow to get signature', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.signature = Uint8Array.from([1, 2, 3])

      assert.deepEqual(transition.signature, Uint8Array.from([1, 2, 3]))
    })

    it('Should allow to get signaturePublicKeyId', function () {
      const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

      const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

      transition.signaturePublicKeyId = 11

      assert.deepEqual(transition.signaturePublicKeyId, 11)
    })
  })
})
