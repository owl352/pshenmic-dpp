import type { PlatformAddressNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { NetworkLike } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export class PlatformAddressWASM {
  /** @private **/
  _rawPlatformAddress: PlatformAddressNAPI

  constructor (address: Uint8Array) {
    this._rawPlatformAddress = new dppProvider.dpp.PlatformAddressNAPI(address)
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

  static createFromRawInstance (rawInstance: PlatformAddressNAPI): PlatformAddressWASM {
    const instance: PlatformAddressWASM = Object.create(PlatformAddressWASM.prototype)
    instance._rawPlatformAddress = rawInstance

    return instance
  }
}
