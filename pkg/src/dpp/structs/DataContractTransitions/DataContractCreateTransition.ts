import type { DataContractCreateTransitionNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js'
import { DataContractWASM } from '../DataContract.js'
import { PlatformVersionLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { valueToDynamicValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class DataContractCreateTransitionWASM {
  /** @private **/
  _rawDataContractCreateTransition: DataContractCreateTransitionNAPI

  constructor (
    dataContract: DataContractWASM,
    identityNonce: bigint,
    platformVersion?: PlatformVersionLike
  ) {
    this._rawDataContractCreateTransition = new dppProvider.dpp.DataContractCreateTransitionNAPI(
      dataContract._rawDataContract,
      identityNonce.toString(),
      valueToDynamicValue(platformVersion)
    )
  }

  get featureVersion (): number {
    return this._rawDataContractCreateTransition.featureVersion
  }

  get identityNonce (): bigint {
    return BigInt(this._rawDataContractCreateTransition.identityNonce)
  }

  verifyProtocolVersion (protocolVersion: number): boolean {
    return this._rawDataContractCreateTransition.verifyProtocolVersion(protocolVersion)
  }

  setDataContract (dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): void {
    this._rawDataContractCreateTransition.setDataContract(dataContract._rawDataContract, valueToDynamicValue(platformVersion))
  }

  getDataContract (platformVersion?: PlatformVersionLike, fullValidation?: boolean): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      this._rawDataContractCreateTransition.getDataContract(valueToDynamicValue(platformVersion), fullValidation)
    )
  }

  calculateMinRequiredFee (platformVersion?: PlatformVersionNAPI): bigint {
    return BigInt(this._rawDataContractCreateTransition.calculateMinRequiredFee(platformVersion))
  }

  bytes (): Uint8Array {
    return this._rawDataContractCreateTransition.bytes()
  }

  hex (): string {
    return this._rawDataContractCreateTransition.hex()
  }

  base64 (): string {
    return this._rawDataContractCreateTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawDataContractCreateTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): DataContractCreateTransitionWASM {
    return DataContractCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractCreateTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): DataContractCreateTransitionWASM {
    return DataContractCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractCreateTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): DataContractCreateTransitionWASM {
    return DataContractCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractCreateTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): DataContractCreateTransitionWASM {
    return DataContractCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractCreateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: DataContractCreateTransitionNAPI): DataContractCreateTransitionWASM {
    const instance: DataContractCreateTransitionWASM = Object.create(DataContractCreateTransitionWASM.prototype)
    instance._rawDataContractCreateTransition = rawInstance

    return instance
  }
}
