import type { PlatformAddressNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { NetworkLike, PlatformAddressLike } from '../../types.js'
import { preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js'

export class PlatformAddressWASM {
  /** @private **/
  _rawPlatformAddress: PlatformAddressNAPI

  constructor (address: PlatformAddressLike) {
    this._rawPlatformAddress = new dppProvider.dpp.PlatformAddressNAPI(preparePlatformAddressValue(address))
  }

  bytes (): Uint8Array {
    return this._rawPlatformAddress.bytes()
  }

  toAddress (network: NetworkLike): string {
    return this._rawPlatformAddress.toAddress(valueToDynamicValue(network))
  }

  toBech32m (network: NetworkLike): string {
    return this._rawPlatformAddress.toBech32m(valueToDynamicValue(network))
  }

  isP2PKH (): boolean {
    return this._rawPlatformAddress.isP2PKH()
  }

  isP2SH (): boolean {
    return this._rawPlatformAddress.isP2SH()
  }

  hash (): Uint8Array {
    return this._rawPlatformAddress.hash()
  }

  /**
   * Storage fee charged for creating balance entries for addresses that are not in state yet.
   *
   * A minimum fee prices every output as a fresh address, but the fee actually charged is
   * metered: paying an address that already exists adds no bytes, while each address created
   * costs this much storage on top of processing.
   */
  static estimateStorageFeeForNewAddresses (
    addressCount: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(dppProvider.dpp.PlatformAddressNAPI.estimateStorageFeeForNewAddresses(addressCount, platformVersion))
  }

  static fromBech32m (bech32m: string): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(
      dppProvider.dpp.PlatformAddressNAPI.fromBech32m(bech32m)
    )
  }

  static fromBytes (bytes: Uint8Array): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(
      dppProvider.dpp.PlatformAddressNAPI.fromBytes(bytes)
    )
  }

  static createFromRawInstance (rawInstance: PlatformAddressNAPI): PlatformAddressWASM {
    const instance: PlatformAddressWASM = Object.create(PlatformAddressWASM.prototype)
    instance._rawPlatformAddress = rawInstance

    return instance
  }
}
