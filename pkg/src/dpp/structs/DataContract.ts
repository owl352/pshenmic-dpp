import type { DataContractNAPI, TokenConfigurationNAPI } from '../../../binaries/bindingsTypes.js'
import { DataContractGroups, DataContractTokens, IdentifierLike, PlatformVersionLike } from '../types.js'
import { dppProvider } from '../provider.js'
import { prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../utils.js'
import { IdentifierWASM } from './Identifier.js'
import { TokenConfigurationWASM } from './TokenConfiguration/TokenConfiguration.js'
import { GroupWASM } from './TokenConfiguration/Group.js'

export class DataContractWASM {
  /** @private **/
  _rawDataContract: DataContractNAPI

  constructor (
    ownerId: IdentifierLike,
    identityNonce: bigint,
    schema?: object,
    definitions?: object,
    tokens?: DataContractTokens[],
    fullValidation?: boolean,
    platformVersion?: PlatformVersionLike
  ) {
    let normalTokens: Array<[number, TokenConfigurationNAPI]> | undefined

    if (tokens != null) {
      normalTokens = []
      for (const token of tokens) {
        normalTokens.push([token.position, token.tokenConfiguration._rawTokenConfiguration])
      }
    }

    this._rawDataContract = new dppProvider.dpp.DataContractNAPI(
      prepareIdentifierValue(ownerId),
      identityNonce.toString(),
      valueToDynamicValue(schema),
      valueToDynamicValue(definitions),
      normalTokens,
      fullValidation,
      valueToDynamicValue(platformVersion)
    )
  }

  get systemVersion (): number {
    return this._rawDataContract.systemVersion
  }

  set systemVersion (value: number) {
    this._rawDataContract.systemVersion = value
  }

  get version (): number {
    return this._rawDataContract.version
  }

  set version (value: number) {
    this._rawDataContract.version = value
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDataContract.id)
  }

  set id (value: IdentifierLike) {
    this._rawDataContract.id = prepareIdentifierValue(value)
  }

  get ownerId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDataContract.ownerId)
  }

  set ownerId (value: IdentifierLike) {
    this._rawDataContract.ownerId = prepareIdentifierValue(value)
  }

  get tokens (): DataContractTokens[] {
    const tokens = this._rawDataContract.tokens

    return tokens.map(([position, token]) => ({
      position,
      tokenConfiguration: TokenConfigurationWASM.createFromRawInstance(token)
    }))
  }

  set tokens (tokens: DataContractTokens[]) {
    let normalTokens: Array<[number, TokenConfigurationNAPI]> | undefined

    if (tokens != null) {
      normalTokens = []
      for (const token of tokens) {
        normalTokens.push([token.position, token.tokenConfiguration._rawTokenConfiguration])
      }
    }

    this._rawDataContract.tokens = normalTokens
  }

  get groups (): DataContractGroups[] {
    return this._rawDataContract.groups.map(([position, group]) => ({
      position,
      group: GroupWASM.createFromRawInstance(group)
    }))
  }

  set groups (groups: DataContractGroups[]) {
    this._rawDataContract.groups = groups.map(({ group, position }) => ([position, group._rawGroup]))
  }

  get description (): string | undefined {
    return this._rawDataContract.description ?? undefined
  }

  set description (value: string | undefined) {
    this._rawDataContract.description = value
  }

  get keywords (): string[] {
    return this._rawDataContract.keywords
  }

  set keywords (value: string[]) {
    this._rawDataContract.keywords = value
  }

  getSchemas (): any {
    return valueFromDynamicValue(this._rawDataContract.getSchemas(), true)
  }

  getConfig (): any {
    return valueFromDynamicValue(this._rawDataContract.getConfig())
  }

  setConfig (value: object, platformVersion?: PlatformVersionLike): void {
    this._rawDataContract.setConfig(valueToDynamicValue(value), valueToDynamicValue(platformVersion))
  }

  bytes (platformVersion: PlatformVersionLike): Uint8Array {
    return this._rawDataContract.bytes(valueToDynamicValue(platformVersion))
  }

  hex (platformVersion: PlatformVersionLike): string {
    return this._rawDataContract.hex(valueToDynamicValue(platformVersion))
  }

  base64 (platformVersion: PlatformVersionLike): string {
    return this._rawDataContract.base64(valueToDynamicValue(platformVersion))
  }

  toJSON (platformVersion: PlatformVersionLike): any {
    return this._rawDataContract.toJson(valueToDynamicValue(platformVersion))
  }

  toValue (platformVersion: PlatformVersionLike): any {
    return valueFromDynamicValue(this._rawDataContract.toValue(valueToDynamicValue(platformVersion))) as object
  }

  static fromValue (value: object, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      dppProvider.dpp.DataContractNAPI.fromValue(valueToDynamicValue(value), fullValidation, valueToDynamicValue(platformVersion))
    )
  }

  static fromBytes (bytes: Uint8Array, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      dppProvider.dpp.DataContractNAPI.fromBytes(bytes, fullValidation, valueToDynamicValue(platformVersion))
    )
  }

  static fromHex (hex: string, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      dppProvider.dpp.DataContractNAPI.fromHex(hex, fullValidation, valueToDynamicValue(platformVersion))
    )
  }

  static fromBase64 (base64: string, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      dppProvider.dpp.DataContractNAPI.fromBase64(base64, fullValidation, valueToDynamicValue(platformVersion))
    )
  }

  static generateId (ownerId: IdentifierLike, identityNonce: bigint): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(
      dppProvider.dpp.DataContractNAPI.generateId(prepareIdentifierValue(ownerId), identityNonce.toString())
    )
  }

  static createFromRawInstance (rawInstance: DataContractNAPI): DataContractWASM {
    const instance: DataContractWASM = Object.create(DataContractWASM.prototype)
    instance._rawDataContract = rawInstance

    return instance
  }
}
