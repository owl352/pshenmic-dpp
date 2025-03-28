const assert = require('assert');
const initWasm = require('./utils/wasm')


let wasm
let keyId
let purpose
let securityLevel
let keyType
let binaryData


describe('Public', function () {

  before(async function () {
    wasm = initWasm()

    keyId = 2;
    purpose = wasm.Purpose.AUTHENTICATION
    securityLevel = wasm.SecurityLevel.CRITICAL
    keyType = wasm.KeyType.ECDSA_SECP256K1
    binaryData = "036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48"
  })

  describe('conversations', function () {
    it("should generate public key from values with type ECDSA_SECP256K1", function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      assert.notEqual(pubKey.__wbg_ptr, 0)
    })

    it("should generate public key from values with type ECDSA_SECP256K1 and return all fields", function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      assert.equal(pubKey.getKeyId(), keyId)
      assert.equal(pubKey.getPurpose(), purpose)
      assert.equal(pubKey.getSecurityLevel(), securityLevel)
      assert.equal(pubKey.getKeyType(), keyType)
      assert.equal(pubKey.getReadOnly(), false)
      assert.equal(pubKey.getData(), binaryData)
    })

    it("should generate public key from values with type ECDSA_SECP256K1 and generate new from self bytes", function () {
      const pubKey = new wasm.IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const bytes = pubKey.toBytes()

      const newPubKey = wasm.IdentityPublicKeyWASM.fromBytes(Array.from(bytes))

      assert.notEqual(pubKey.__wbg_ptr, 0)
      assert.notEqual(newPubKey, 0)

      assert.equal(pubKey.getKeyId(), newPubKey.getKeyId())
      assert.equal(pubKey.getPurpose(), newPubKey.getPurpose())
      assert.equal(pubKey.getSecurityLevel(), newPubKey.getSecurityLevel())
      assert.equal(pubKey.getKeyType(), newPubKey.getKeyType())
      assert.equal(pubKey.getReadOnly(), newPubKey.getReadOnly())
      assert.equal(pubKey.getData(), newPubKey.getData())

      assert.deepEqual(pubKey.toBytes(), newPubKey.toBytes())
    })
  });
});
