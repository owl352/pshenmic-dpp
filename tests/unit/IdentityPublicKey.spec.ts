import {IdentityPublicKeyWASM, Purpose, SecurityLevel, KeyType} from '../../dist/src/wasm.js'

let keyId: number
let purpose: Purpose
let securityLevel: SecurityLevel
let keyType: KeyType
let binaryData: string

describe('PublicKey', function () {
  beforeAll(function () {
    keyId = 0
    purpose = Purpose.DECRYPTION
    securityLevel = SecurityLevel.HIGH
    keyType = KeyType.ECDSA_SECP256K1
    binaryData = '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
  })

  describe('serialization / deserialization', function () {
    test('should generate public key from values with type ECDSA_SECP256K1', function () {
      const pubKey = new IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      expect(pubKey.data).toEqual(binaryData)
    })

    test('should generate public key from values with type ECDSA_SECP256K1 and generate new from self bytes', function () {
      const pubKey = new IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const bytes = pubKey.bytes()

      const newPubKey = IdentityPublicKeyWASM.fromBytes(bytes)

      expect(pubKey.keyId).toEqual(newPubKey.keyId)
      expect(pubKey.purpose).toEqual(newPubKey.purpose)
      expect(pubKey.securityLevel).toEqual(newPubKey.securityLevel)
      expect(pubKey.keyType).toEqual(newPubKey.keyType)
      expect(pubKey.readOnly).toEqual(newPubKey.readOnly)
      expect(pubKey.data).toEqual(newPubKey.data)

      expect(pubKey.bytes()).toEqual(newPubKey.bytes())
    })

    test('should return hash of key', function () {
      const pubKey = new IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      const hash = pubKey.getPublicKeyHash()

      expect(hash).toEqual('d372f096259f72686e18663d7db5f86234dd6f55')
    })
  })
  describe('getters', function () {
    test('should generate public key from values with type ECDSA_SECP256K1 and return all fields', function () {
      const pubKey = new IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      expect(pubKey.keyId).toEqual(keyId)
      expect(pubKey.purpose).toEqual('DECRYPTION')
      expect(pubKey.securityLevel).toEqual('HIGH')
      expect(pubKey.keyType).toEqual('ECDSA_SECP256K1')
      expect(pubKey.readOnly).toEqual(false)
      expect(pubKey.data).toEqual(binaryData)
    })

    // test('should allow to validate private key', function () {
    //   const pubKey = new IdentityPublicKeyWASM(
    //     keyId,
    //     purpose,
    //     securityLevel,
    //     keyType,
    //     false,
    //     binaryData)
    //
    //   const privateKey = PrivateKeyWASM.fromWIF(wif)
    //
    //   assert.equal(pubKey.validatePrivateKey(privateKey.bytes(), NetworkWASM.Mainnet), false)
    // })
  })

  describe('setters', function () {
    test('should generate public key from values with type ECDSA_SECP256K1 and return all fields and set another fields', function () {
      const pubKey = new IdentityPublicKeyWASM(
        keyId,
        purpose,
        securityLevel,
        keyType,
        false,
        binaryData)

      pubKey.keyId = 1
      pubKey.purpose = Purpose.TRANSFER
      pubKey.securityLevel = SecurityLevel.MEDIUM
      pubKey.keyType = KeyType.EDDSA_25519_HASH160
      pubKey.readOnly = true
      pubKey.data = '111a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'

      expect(pubKey.keyId).toEqual(1)
      expect(pubKey.purpose).toEqual('TRANSFER')
      expect(pubKey.securityLevel).toEqual('MEDIUM')
      expect(pubKey.keyType).toEqual('EDDSA_25519_HASH160')
      expect(pubKey.readOnly).toEqual(true)
      expect(pubKey.data).toEqual('111a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')
    })
  })
})
