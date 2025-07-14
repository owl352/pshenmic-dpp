const assert = require('assert')
const { describe, it } = require('mocha')
const { default: wasm } = require('..')

describe('IdentityCreditTransferTransition', function () {
  describe('serialization / deserialization', function () {
    it('Should create IdentityCreditTransferTransition with empty platform version', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.notEqual(transition.__wbg_ptr, 0)
    })

    it('Should create IdentityCreditTransferTransition with non empty platform version', async function () {
      const sender = new wasm.IdentifierWASM('11111111111111111111111111111111')
      const recipient = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), sender, recipient, BigInt(199), 'platform_v1')

      assert.notEqual(transition.__wbg_ptr, 0)
      assert.notEqual(sender.__wbg_ptr, 0)
      assert.notEqual(recipient.__wbg_ptr, 0)
    })
  })

  describe('getters', function () {
    it('Should return recipientId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.recipientId.base58(), 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
    })

    it('Should return senderId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.senderId.base58(), '11111111111111111111111111111111')
    })

    it('Should return amount', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.amount, BigInt(100))
    })

    it('Should return nonce', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.nonce, BigInt(199))
    })

    it('Should return signature', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.signature, Uint8Array.from([]))
    })

    it('Should return signaturePublicKeyId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.signaturePublicKeyId, 0)
    })

    it('Should return userFeeIncrease', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      assert.deepEqual(transition.userFeeIncrease, 0)
    })
  })

  describe('setters', function () {
    it('Should allow to set recipientId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      const recipient = new wasm.IdentifierWASM('11111111111111111111111111111111')

      transition.recipientId = recipient

      assert.deepEqual(transition.recipientId.base58(), '11111111111111111111111111111111')

      transition.recipientId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'

      assert.deepEqual(transition.recipientId.base58(), 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
      assert.notEqual(recipient.__wbg_ptr, 0)
    })

    it('Should return senderId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      const sender = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

      transition.senderId = sender

      assert.deepEqual(transition.senderId.base58(), 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')

      transition.senderId = '11111111111111111111111111111111'

      assert.notEqual(sender.__wbg_ptr, 0)
      assert.deepEqual(transition.senderId.base58(), '11111111111111111111111111111111')
    })

    it('Should return amount', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      transition.amount = BigInt(199)

      assert.deepEqual(transition.amount, BigInt(199))
    })

    it('Should return nonce', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      transition.nonce = BigInt(1)

      assert.deepEqual(transition.nonce, BigInt(1))
    })

    it('Should return signature', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      transition.signature = [1, 1]

      assert.deepEqual(transition.signature, Uint8Array.from([1, 1]))
    })

    it('Should return signaturePublicKeyId', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      transition.signaturePublicKeyId = 11

      assert.deepEqual(transition.signaturePublicKeyId, 11)
    })

    it('Should return userFeeIncrease', async function () {
      const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

      transition.userFeeIncrease = 11

      assert.deepEqual(transition.userFeeIncrease, 11)
    })
  })
})
