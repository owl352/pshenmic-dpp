import { DocumentNAPI } from '../../../binaries/bindingsTypes.js'
import { IdentifierLike, PlatformVersionLike } from '../types.js'
import { dppProvider } from '../provider.js'
import { prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../utils.js'
import { IdentifierWASM } from './Identifier.js'
import { DataContractWASM } from './DataContract.js'

export class DocumentWASM {
  /** @private **/
  _rawDocument: DocumentNAPI

  constructor (
    documentContent: object,
    documentTypeName: string,
    revision: bigint,
    dataContractId: IdentifierLike,
    ownerId: IdentifierLike,
    documentId?: IdentifierLike,
    creatorId?: IdentifierLike
  ) {
    this._rawDocument = new dppProvider.dpp.DocumentNAPI(
      valueToDynamicValue(documentContent),
      documentTypeName,
      revision.toString(),
      prepareIdentifierValue(dataContractId),
      prepareIdentifierValue(ownerId),
      documentId != null ? prepareIdentifierValue(documentId) : undefined,
      creatorId != null ? prepareIdentifierValue(creatorId) : undefined
    )
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocument.id)
  }

  set id (id: IdentifierWASM) {
    this._rawDocument.id = id._rawIdentifier
  }

  get entropy (): Uint8Array | undefined {
    return this._rawDocument.entropy ?? undefined
  }

  set entropy (value: Uint8Array | undefined) {
    this._rawDocument.entropy = value
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocument.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawDocument.dataContractId = prepareIdentifierValue(value)
  }

  get ownerId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocument.ownerId)
  }

  set ownerId (value: IdentifierLike) {
    this._rawDocument.ownerId = prepareIdentifierValue(value)
  }

  get properties (): object {
    return valueFromDynamicValue(this._rawDocument.properties)
  }

  set properties (value: object) {
    this._rawDocument.properties = valueToDynamicValue(value)
  }

  get revision (): bigint | undefined {
    const revision = this._rawDocument.revision
    return revision != null ? BigInt(revision) : undefined
  }

  set revision (value: bigint | undefined) {
    this._rawDocument.revision = value?.toString()
  }

  get createdAt (): bigint | undefined {
    const createdAt = this._rawDocument.createdAt

    if (createdAt != null) {
      return BigInt(createdAt)
    }
  }

  set createdAt (timestamp: Date | number | bigint | undefined) {
    if (timestamp instanceof Date) {
      this._rawDocument.createdAt = timestamp.getTime().toString()
    } else if (timestamp == null) {
      this._rawDocument.createdAt = undefined
    } else {
      this._rawDocument.createdAt = timestamp.toString()
    }
  }

  get updatedAt (): bigint | undefined {
    const updatedAt = this._rawDocument.updatedAt

    if (updatedAt != null) {
      return BigInt(updatedAt)
    }
  }

  set updatedAt (timestamp: Date | number | bigint | undefined) {
    if (timestamp instanceof Date) {
      this._rawDocument.updatedAt = timestamp.getTime().toString()
    } else if (timestamp == null) {
      this._rawDocument.updatedAt = undefined
    } else {
      this._rawDocument.updatedAt = timestamp.toString()
    }
  }

  get transferredAt (): bigint | undefined {
    const transferredAt = this._rawDocument.transferredAt

    if (transferredAt != null) {
      return BigInt(transferredAt)
    }
  }

  set transferredAt (timestamp: Date | number | bigint | undefined) {
    if (timestamp instanceof Date) {
      this._rawDocument.transferredAt = timestamp.getTime().toString()
    } else if (timestamp == null) {
      this._rawDocument.transferredAt = undefined
    } else {
      this._rawDocument.transferredAt = timestamp.toString()
    }
  }

  get createdAtBlockHeight (): bigint | undefined {
    const createdAtBlockHeight = this._rawDocument.createdAtBlockHeight

    if (createdAtBlockHeight != null) {
      return BigInt(createdAtBlockHeight)
    }
  }

  set createdAtBlockHeight (value: bigint | undefined) {
    this._rawDocument.createdAtBlockHeight = value?.toString()
  }

  get updatedAtBlockHeight (): bigint | undefined {
    const updatedAtBlockHeight = this._rawDocument.createdAtBlockHeight
    if (updatedAtBlockHeight != null) {
      return BigInt(updatedAtBlockHeight)
    }
  }

  set updatedAtBlockHeight (value: bigint | undefined) {
    this._rawDocument.createdAtBlockHeight = value?.toString()
  }

  get transferredAtBlockHeight (): bigint | undefined {
    const transferredAtBlockHeight = this._rawDocument.createdAtBlockHeight
    if (transferredAtBlockHeight != null) {
      return BigInt(transferredAtBlockHeight)
    }
  }

  set transferredAtBlockHeight (value: bigint | undefined) {
    this._rawDocument.createdAtBlockHeight = value?.toString()
  }

  get createdAtCoreBlockHeight (): number | undefined {
    return this._rawDocument.createdAtCoreBlockHeight ?? undefined
  }

  set createdAtCoreBlockHeight (value: number | undefined) {
    this._rawDocument.createdAtCoreBlockHeight = value
  }

  get updatedAtCoreBlockHeight (): number | undefined {
    return this._rawDocument.updatedAtCoreBlockHeight ?? undefined
  }

  set updatedAtCoreBlockHeight (value: number | undefined) {
    this._rawDocument.createdAtCoreBlockHeight = value
  }

  get transferredAtCoreBlockHeight (): number | undefined {
    return this._rawDocument.transferredAtCoreBlockHeight ?? undefined
  }

  set transferredAtCoreBlockHeight (value: number | undefined) {
    this._rawDocument.createdAtCoreBlockHeight = value
  }

  get documentTypeName (): string {
    return this._rawDocument.documentTypeName
  }

  set documentTypeName (value: string) {
    this._rawDocument.documentTypeName = value
  }

  get creatorId (): IdentifierWASM | undefined {
    const id = this._rawDocument.creatorId

    if (id != null) {
      return IdentifierWASM.createFromRawInstance(id)
    }
  }

  set creatorId (value: IdentifierLike) {
    this._rawDocument.creatorId = prepareIdentifierValue(value)
  }

  bytes (dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): Uint8Array {
    return this._rawDocument.bytes(dataContract._rawDataContract, valueToDynamicValue(platformVersion))
  }

  hex (dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): string {
    return this._rawDocument.hex(dataContract._rawDataContract, valueToDynamicValue(platformVersion))
  }

  base64 (dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): string {
    return this._rawDocument.base64(dataContract._rawDataContract, valueToDynamicValue(platformVersion))
  }

  static fromBytes (bytes: Uint8Array, dataContract: DataContractWASM, documentTypeName: string, platformVersion?: PlatformVersionLike): DocumentWASM {
    return DocumentWASM.createFromRawInstance(
      dppProvider.dpp.DocumentNAPI.fromBytes(bytes, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion))
    )
  }

  static fromHex (hex: string, dataContract: DataContractWASM, documentTypeName: string, platformVersion?: PlatformVersionLike): DocumentWASM {
    return DocumentWASM.createFromRawInstance(
      dppProvider.dpp.DocumentNAPI.fromHex(hex, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion))
    )
  }

  static fromBase64 (base64: string, dataContract: DataContractWASM, documentTypeName: string, platformVersion?: PlatformVersionLike): DocumentWASM {
    return DocumentWASM.createFromRawInstance(
      dppProvider.dpp.DocumentNAPI.fromBase64(base64, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion))
    )
  }

  static generateId (
    documentTypeName: string,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    entropy?: Uint8Array
  ): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(
      dppProvider.dpp.DocumentNAPI.generateId(
        documentTypeName,
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        entropy
      )
    )
  }

  static createFromRawInstance (rawInstance: DocumentNAPI): DocumentWASM {
    const instance: DocumentWASM = Object.create(this.prototype)
    instance._rawDocument = rawInstance

    return instance
  }
}
