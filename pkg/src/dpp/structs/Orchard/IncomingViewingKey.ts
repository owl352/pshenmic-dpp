import type { IncomingViewingKeyNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { ScopeLike } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { FullViewingKeyWASM } from './FullViewingKey.js'
import { OrchardAddressWASM } from './OrchardAddress.js'

/**
 * An Orchard incoming viewing key: it detects and decrypts notes sent to you,
 * but cannot see outgoing notes, tell when a note is spent, or spend it — safe
 * to hand to a watch-only service.
 */
export class IncomingViewingKeyWASM {
  /** @private **/
  _rawIncomingViewingKey: IncomingViewingKeyNAPI

  /** The 64-byte raw encoding of this key (dk || ivk). */
  bytes (): Uint8Array {
    return this._rawIncomingViewingKey.bytes()
  }

  /** The payment address at `diversifierIndex` (default 0); scope is fixed by the key. */
  address (diversifierIndex?: number): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(
      this._rawIncomingViewingKey.address(diversifierIndex)
    )
  }

  /** The diversifier index `address` was derived at, or null if it is not from this key. */
  diversifierIndex (address: OrchardAddressWASM): number | null {
    return this._rawIncomingViewingKey.diversifierIndex(address._rawOrchardAddress)
  }

  /**
   * Derives the incoming viewing key from a BIP-39 seed via ZIP-32
   * (m/32'/coinType'/account') for the given scope (default External).
   */
  static fromSeed (
    seed: Uint8Array,
    coinType: number,
    account: number,
    scope?: ScopeLike
  ): IncomingViewingKeyWASM {
    return IncomingViewingKeyWASM.createFromRawInstance(
      dppProvider.dpp.IncomingViewingKeyNAPI.fromSeed(
        seed,
        coinType,
        account,
        scope == null ? undefined : valueToDynamicValue(scope)
      )
    )
  }

  /** Derives the incoming viewing key from a full viewing key (default External scope). */
  static fromFullViewingKey (
    fullViewingKey: FullViewingKeyWASM,
    scope?: ScopeLike
  ): IncomingViewingKeyWASM {
    return IncomingViewingKeyWASM.createFromRawInstance(
      dppProvider.dpp.IncomingViewingKeyNAPI.fromFullViewingKey(
        fullViewingKey._rawFullViewingKey,
        scope == null ? undefined : valueToDynamicValue(scope)
      )
    )
  }

  /** Parses an incoming viewing key from its 64-byte raw encoding. */
  static fromBytes (bytes: Uint8Array): IncomingViewingKeyWASM {
    return IncomingViewingKeyWASM.createFromRawInstance(
      dppProvider.dpp.IncomingViewingKeyNAPI.fromBytes(bytes)
    )
  }

  static createFromRawInstance (rawInstance: IncomingViewingKeyNAPI): IncomingViewingKeyWASM {
    const instance: IncomingViewingKeyWASM = Object.create(IncomingViewingKeyWASM.prototype)
    instance._rawIncomingViewingKey = rawInstance

    return instance
  }
}
