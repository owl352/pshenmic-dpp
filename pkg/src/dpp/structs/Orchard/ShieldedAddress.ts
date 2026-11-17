import type { ShieldedAddressNAPI } from 'pshenmic-orchard/bindingsTypes'
import { dppProvider } from '../../provider.js'
import { NetworkLike, ScopeLike } from '../../types.js'
import { valueToShieldedDynamicValue } from '../../utils.js'
import { FullViewingKeyWASM } from './FullViewingKey.js'
import { IncomingViewingKeyWASM } from './IncomingViewingKey.js'

export class ShieldedAddressWASM {
  /** @private **/
  _rawShieldedAddress: ShieldedAddressNAPI

  toBech32m (network: NetworkLike): string {
    return this._rawShieldedAddress.toBech32m(valueToShieldedDynamicValue(network))
  }

  bytes (): Uint8Array {
    return this._rawShieldedAddress.bytes()
  }

  static fromBech32m (bech32m: string): ShieldedAddressWASM {
    return ShieldedAddressWASM.createFromRawInstance(
      dppProvider.shielded.ShieldedAddressNAPI.fromBech32m(bech32m)
    )
  }

  static fromBytes (bytes: Uint8Array): ShieldedAddressWASM {
    return ShieldedAddressWASM.createFromRawInstance(
      dppProvider.shielded.ShieldedAddressNAPI.fromBytes(bytes)
    )
  }

  /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
  static fromSeed (
    seed: Uint8Array,
    coinType: number,
    account: number,
    diversifierIndex?: number,
    scope?: ScopeLike
  ): ShieldedAddressWASM {
    return ShieldedAddressWASM.createFromRawInstance(
      dppProvider.shielded.ShieldedAddressNAPI.fromSeed(
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
  ): ShieldedAddressWASM {
    return ShieldedAddressWASM.createFromRawInstance(
      dppProvider.shielded.ShieldedAddressNAPI.fromFullViewingKey(
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
  ): ShieldedAddressWASM {
    return ShieldedAddressWASM.createFromRawInstance(
      dppProvider.shielded.ShieldedAddressNAPI.fromIncomingViewingKey(
        incomingViewingKey._rawIncomingViewingKey,
        diversifierIndex
      )
    )
  }

  static createFromRawInstance (rawInstance: ShieldedAddressNAPI): ShieldedAddressWASM {
    const instance: ShieldedAddressWASM = Object.create(ShieldedAddressWASM.prototype)
    instance._rawShieldedAddress = rawInstance

    return instance
  }
}

/** Derives the sender's shielded outgoing viewing key (32 bytes) from a BIP-39 seed. */
export function shieldedOvkFromSeed (seed: Uint8Array, coinType: number, account: number): Uint8Array {
  return dppProvider.shielded.shieldedOvkFromSeed(seed, coinType, account)
}