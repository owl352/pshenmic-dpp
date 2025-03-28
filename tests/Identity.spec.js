const assert = require('assert');
const initWasm = require('./utils/wasm')
const {identifier, identityBytesWithoutKeys} = require("./mocks/Identity");
const {keyId, purpose, securityLevel, keyType, binaryData} = require("./mocks/PublicKey");

let wasm

describe('Identity', function () {

  before(async function () {
    wasm = initWasm()
  })

  describe('conversations', function () {
    it("should generate identity from identifier", async function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.notEqual(identity.__wbg_ptr, 0)
    })

    it("should generate identity from identifier and return bytes", async function () {
      const identity = new wasm.IdentityWASM(identifier)

      assert.deepEqual(Array.from(identity.toBytes()), identityBytesWithoutKeys)

      const newIdentity = wasm.IdentityWASM.fromBytes(identity.toBytes())

      assert.notEqual(identity.__wbg_ptr, 0)
      assert.notEqual(newIdentity.__wbg_ptr, 0)
    })
  })


  describe('getters', function () {
    it("should generate public key from values with type ECDSA_SECP256K1 and return all fields", function () {

    })
  })

  describe('setters', function () {
    it("should allows to set public key", function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const identity = new wasm.IdentityWASM(identifier)

      identity.addPublicKey(pubKey)

      assert.notEqual(identity.__wbg_ptr, 0)

      assert.deepEqual(identity.getPublicKeyById(keyId).toBytes(), pubKey.toBytes())
    })
  })
})
