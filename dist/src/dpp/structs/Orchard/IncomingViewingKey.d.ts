import type { IncomingViewingKeyNAPI } from 'dash-platform-shielded/bindingsTypes';
import { ScopeLike } from '../../types.js';
import { FullViewingKeyWASM } from './FullViewingKey.js';
import { OrchardAddressWASM } from './OrchardAddress.js';
/**
 * An Orchard incoming viewing key: it detects and decrypts notes sent to you,
 * but cannot see outgoing notes, tell when a note is spent, or spend it — safe
 * to hand to a watch-only service.
 */
export declare class IncomingViewingKeyWASM {
    /** @private **/
    _rawIncomingViewingKey: IncomingViewingKeyNAPI;
    /** The 64-byte raw encoding of this key (dk || ivk). */
    bytes(): Uint8Array;
    /** The payment address at `diversifierIndex` (default 0); scope is fixed by the key. */
    address(diversifierIndex?: number): OrchardAddressWASM;
    /** The diversifier index `address` was derived at, or null if it is not from this key. */
    diversifierIndex(address: OrchardAddressWASM): number | null;
    /**
     * Derives the incoming viewing key from a BIP-39 seed via ZIP-32
     * (m/32'/coinType'/account') for the given scope (default External).
     */
    static fromSeed(seed: Uint8Array, coinType: number, account: number, scope?: ScopeLike): IncomingViewingKeyWASM;
    /** Derives the incoming viewing key from a full viewing key (default External scope). */
    static fromFullViewingKey(fullViewingKey: FullViewingKeyWASM, scope?: ScopeLike): IncomingViewingKeyWASM;
    /** Parses an incoming viewing key from its 64-byte raw encoding. */
    static fromBytes(bytes: Uint8Array): IncomingViewingKeyWASM;
    static createFromRawInstance(rawInstance: IncomingViewingKeyNAPI): IncomingViewingKeyWASM;
}
