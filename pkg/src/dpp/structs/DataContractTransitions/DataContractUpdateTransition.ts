import { DataContractUpdateTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { DataContractWASM } from '../DataContract.js'
import { PlatformVersionLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { valueToDynamicValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class DataContractUpdateTransitionWASM {
  /** @private **/
  _rawDataContractUpdateTransition: DataContractUpdateTransitionNAPI

  constructor (
    dataContract: DataContractWASM,
    identityNonce: bigint,
    platformVersion?: PlatformVersionLike
  ) {
    this._rawDataContractUpdateTransition = new dppProvider.dpp.DataContractUpdateTransitionNAPI(
      dataContract._rawDataContract,
      identityNonce.toString(),
      valueToDynamicValue(platformVersion)
    )
  }

  get featureVersion (): number {
    return this._rawDataContractUpdateTransition.featureVersion
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawDataContractUpdateTransition.identityContractNonce)
  }

  verifyProtocolVersion (protocolVersion: number): boolean {
    return this._rawDataContractUpdateTransition.verifyProtocolVersion(protocolVersion)
  }

  setDataContract (dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): void {
    this._rawDataContractUpdateTransition.setDataContract(dataContract._rawDataContract, valueToDynamicValue(platformVersion))
  }

  getDataContract (fullValidation?: boolean, platformVersion?: PlatformVersionLike): DataContractWASM {
    return DataContractWASM.createFromRawInstance(
      this._rawDataContractUpdateTransition.getDataContract(fullValidation, valueToDynamicValue(platformVersion))
    )
  }

  bytes (): Uint8Array {
    return this._rawDataContractUpdateTransition.bytes()
  }

  hex (): string {
    return this._rawDataContractUpdateTransition.hex()
  }

  base64 (): string {
    return this._rawDataContractUpdateTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawDataContractUpdateTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): DataContractUpdateTransitionWASM {
    return DataContractUpdateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractUpdateTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): DataContractUpdateTransitionWASM {
    return DataContractUpdateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractUpdateTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): DataContractUpdateTransitionWASM {
    return DataContractUpdateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractUpdateTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): DataContractUpdateTransitionWASM {
    return DataContractUpdateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DataContractUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: DataContractUpdateTransitionNAPI): DataContractUpdateTransitionWASM {
    const instance: DataContractUpdateTransitionWASM = Object.create(this.prototype)
    instance._rawDataContractUpdateTransition = rawInstance

    return instance
  }
}
