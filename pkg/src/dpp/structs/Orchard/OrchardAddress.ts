import type { OrchardAddressNAPI } from 'dash-platform-shielded/bindingsTypes'
import { dppProvider } from '../../provider.js'
import { NetworkLike, ScopeLike } from '../../types.js'
import { valueToShieldedDynamicValue } from '../../utils.js'
import { FullViewingKeyWASM } from './FullViewingKey.js'
import { IncomingViewingKeyWASM } from './IncomingViewingKey.js'

export class OrchardAddressWASM {
  /** @private **/
  _rawOrchardAddress: OrchardAddressNAPI

  toBech32m (network: NetworkLike): string {
    return this._rawOrchardAddress.toBech32m(valueToShieldedDynamicValue(network))
  }

  bytes (): Uint8Array {
    return this._rawOrchardAddress.bytes()
  }

  static fromBech32m (bech32m: string): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.shielded.OrchardAddressNAPI.fromBech32m(bech32m)
    )
  }

  static fromBytes (bytes: Uint8Array): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.shielded.OrchardAddressNAPI.fromBytes(bytes)
    )
  }

  /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
  static fromSeed (
    seed: Uint8Array,
    coinType: number,
    account: number,
    diversifierIndex?: number,
    scope?: ScopeLike
  ): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.shielded.OrchardAddressNAPI.fromSeed(
        seed,
        coinType,
        account,
        diversifierIndex,
        scope == null ? undefined : valueToShieldedDynamicValue(scope)
      )
    )
  }

  /**
   * Derives the address at `diversifierIndex` (default 0) from a full viewing
   * key, for `scope` (default External).
   */
  static fromFullViewingKey (
    fullViewingKey: FullViewingKeyWASM,
    diversifierIndex?: number,
    scope?: ScopeLike
  ): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.shielded.OrchardAddressNAPI.fromFullViewingKey(
        fullViewingKey._rawFullViewingKey,
        diversifierIndex,
        scope == null ? undefined : valueToShieldedDynamicValue(scope)
      )
    )
  }

  /**
   * Derives the address at `diversifierIndex` (default 0) from an incoming
   * viewing key. The scope is fixed by the key itself.
   */
  static fromIncomingViewingKey (
    incomingViewingKey: IncomingViewingKeyWASM,
    diversifierIndex?: number
  ): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      dppProvider.shielded.OrchardAddressNAPI.fromIncomingViewingKey(
        incomingViewingKey._rawIncomingViewingKey,
        diversifierIndex
      )
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
  return dppProvider.shielded.orchardOvkFromSeed(seed, coinType, account)
}
