import { createHash } from 'node:crypto'
import { DocumentWASM, IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'

const OWNER_ID = 'HEAmUtC72dPcZ59yyLUgfS8pfrEWqzYfDPzTofgWxXRr'
const CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'
const DOCUMENT_TYPE = 'note'
const ENTROPY = new Uint8Array(32).fill(7)

const sha256d = (data: Buffer): Uint8Array =>
  createHash('sha256').update(createHash('sha256').update(data).digest()).digest()

const nonceBytes = (nonce: bigint): Buffer => {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(nonce)
  return buf
}

// contract id || owner id || type name || entropy
const expectedIdV0 = (): string => IdentifierWASM.fromBytes(sha256d(Buffer.concat([
  new IdentifierWASM(CONTRACT_ID).bytes(),
  new IdentifierWASM(OWNER_ID).bytes(),
  Buffer.from(DOCUMENT_TYPE),
  ENTROPY
]))).base58()

// domain tag || contract id || owner id || type name || entropy || nonce (u64 BE)
const expectedIdV1 = (nonce: bigint): string => IdentifierWASM.fromBytes(sha256d(Buffer.concat([
  Buffer.from('dash:document-id:v1'),
  new IdentifierWASM(CONTRACT_ID).bytes(),
  new IdentifierWASM(OWNER_ID).bytes(),
  Buffer.from(DOCUMENT_TYPE),
  ENTROPY,
  nonceBytes(nonce)
]))).base58()

describe('Document', function () {
  describe('generateId', function () {
    test('should derive id from entropy only before PLATFORM_V14', function () {
      const id = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY, BigInt(5), PlatformVersionWASM.PLATFORM_V13)

      expect(id.base58()).toEqual(expectedIdV0())
    })

    test('should include identity contract nonce from PLATFORM_V14', function () {
      const id = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY, BigInt(5), PlatformVersionWASM.PLATFORM_V14)

      expect(id.base58()).toEqual(expectedIdV1(BigInt(5)))
    })

    test('should use latest platform version and zero nonce by default', function () {
      const id = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY)

      expect(id.base58()).toEqual(expectedIdV1(BigInt(0)))
    })

    test('should produce different ids for different nonces', function () {
      const first = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY, BigInt(1))
      const second = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY, BigInt(2))

      expect(first.base58()).not.toEqual(second.base58())
    })

    test('should generate entropy when not provided', function () {
      const first = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID)
      const second = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID)

      expect(first.base58()).not.toEqual(second.base58())
    })
  })

  describe('constructor', function () {
    test('should derive id from generated entropy and identity contract nonce', function () {
      const document = new DocumentWASM({ message: 'hello' }, DOCUMENT_TYPE, BigInt(1), CONTRACT_ID, OWNER_ID, undefined, undefined, BigInt(3))

      const expectedId = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, document.entropy, BigInt(3))

      expect(document.entropy?.length).toEqual(32)
      expect(document.id.base58()).toEqual(expectedId.base58())
    })

    test('should use zero nonce when identity contract nonce is not provided', function () {
      const document = new DocumentWASM({ message: 'hello' }, DOCUMENT_TYPE, BigInt(1), CONTRACT_ID, OWNER_ID)

      const expectedId = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, document.entropy, BigInt(0))

      expect(document.id.base58()).toEqual(expectedId.base58())
    })

    test('should derive id with provided platform version', function () {
      const document = new DocumentWASM({ message: 'hello' }, DOCUMENT_TYPE, BigInt(1), CONTRACT_ID, OWNER_ID, undefined, undefined, BigInt(3), PlatformVersionWASM.PLATFORM_V13)

      const expectedId = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, document.entropy, BigInt(3), PlatformVersionWASM.PLATFORM_V13)
      const nonceAwareId = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, document.entropy, BigInt(3), PlatformVersionWASM.PLATFORM_V14)

      expect(document.id.base58()).toEqual(expectedId.base58())
      expect(document.id.base58()).not.toEqual(nonceAwareId.base58())
    })

    test('should keep provided document id', function () {
      const documentId = DocumentWASM.generateId(DOCUMENT_TYPE, OWNER_ID, CONTRACT_ID, ENTROPY, BigInt(9))

      const document = new DocumentWASM({ message: 'hello' }, DOCUMENT_TYPE, BigInt(1), CONTRACT_ID, OWNER_ID, documentId, undefined, BigInt(3))

      expect(document.id.base58()).toEqual(documentId.base58())
    })

    test('should set fields from constructor', function () {
      const document = new DocumentWASM({ message: 'hello' }, DOCUMENT_TYPE, BigInt(2), CONTRACT_ID, OWNER_ID, undefined, OWNER_ID)

      expect(document.documentTypeName).toEqual(DOCUMENT_TYPE)
      expect(document.revision).toEqual(BigInt(2))
      expect(document.dataContractId.base58()).toEqual(CONTRACT_ID)
      expect(document.ownerId.base58()).toEqual(OWNER_ID)
      expect(document.creatorId?.base58()).toEqual(OWNER_ID)
      expect(document.properties).toEqual({ message: 'hello' })
    })
  })
})
