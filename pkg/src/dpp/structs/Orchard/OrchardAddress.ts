import type { OrchardAddressNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { NetworkLike } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export class OrchardAddressWASM {
  /** @private **/
  _rawOrchardAddress: OrchardAddressNAPI

  toBech32m (network: NetworkLike): string {
    return this._rawOrchardAddress.toBech32m(valueToDynamicValue(network))
  }

  bytes (): Uint8Array {
    return this._rawOrchardAddress.bytes()
  }

  static fromBech32m (bech32m: string): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.dpp.OrchardAddressNAPI.fromBech32m(bech32m)
    )
  }

  static fromBytes (bytes: Uint8Array): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.dpp.OrchardAddressNAPI.fromBytes(bytes)
    )
  }

  /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
  static fromSeed (seed: Uint8Array, coinType: number, account: number, diversifierIndex?: number): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.dpp.OrchardAddressNAPI.fromSeed(seed, coinType, account, diversifierIndex)
    )
  }

  static createFromRawInstance (rawInstance: OrchardAddressNAPI): OrchardAddressWASM {
    const instance: OrchardAddressWASM = Object.create(OrchardAddressWASM.prototype)
    instance._rawOrchardAddress = rawInstance

    return instance
  }
}

/** Derives the sender's Orchard outgoing viewing key (32 bytes) from a BIP-39 seed. */
export function orchardOvkFromSeed (seed: Uint8Array, coinType: number, account: number): Uint8Array {
  return dppProvider.dpp.orchardOvkFromSeed(seed, coinType, account)
}