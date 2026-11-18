import type { ShieldedAddressNAPI } from 'dash-platform-shielded/bindingsTypes';
import { NetworkLike, ScopeLike } from '../../types.js';
import { FullViewingKeyWASM } from './FullViewingKey.js';
import { IncomingViewingKeyWASM } from './IncomingViewingKey.js';
export declare class ShieldedAddressWASM {
    /** @private **/
    _rawShieldedAddress: ShieldedAddressNAPI;
    toBech32m(network: NetworkLike): string;
    bytes(): Uint8Array;
    static fromBech32m(bech32m: string): ShieldedAddressWASM;
    static fromBytes(bytes: Uint8Array): ShieldedAddressWASM;
    /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
    static fromSeed(seed: Uint8Array, coinType: number, account: number, diversifierIndex?: number, scope?: ScopeLike): ShieldedAddressWASM;
    /**
     * Derives the address at `diversifierIndex` (default 0) from a full viewing
     * key, for `scope` (default External).
     */
    static fromFullViewingKey(fullViewingKey: FullViewingKeyWASM, diversifierIndex?: number, scope?: ScopeLike): ShieldedAddressWASM;
    /**
     * Derives the address at `diversifierIndex` (default 0) from an incoming
     * viewing key. The scope is fixed by the key itself.
     */
    static fromIncomingViewingKey(incomingViewingKey: IncomingViewingKeyWASM, diversifierIndex?: number): ShieldedAddressWASM;
    static createFromRawInstance(rawInstance: ShieldedAddressNAPI): ShieldedAddressWASM;
}
/** Derives the sender's shielded outgoing viewing key (32 bytes) from a BIP-39 seed. */
export declare function shieldedOvkFromSeed(seed: Uint8Array, coinType: number, account: number): Uint8Array;
