import { dppProvider } from '../../provider.js';
import { valueToShieldedDynamicValue } from '../../utils.js';
import { IncomingViewingKeyWASM } from './IncomingViewingKey.js';
import { OrchardAddressWASM } from './OrchardAddress.js';
/**
 * An Orchard full viewing key: it detects both incoming and outgoing notes and
 * computes their nullifiers (so it sees the full balance), but cannot spend.
 */
export class FullViewingKeyWASM {
    /** @private **/
    _rawFullViewingKey;
    /** The 96-byte raw encoding of this key (ak || nk || rivk). */
    bytes() {
        return this._rawFullViewingKey.bytes();
    }
    /** Derives the incoming viewing key for the given scope (default External). */
    toIvk(scope) {
        return IncomingViewingKeyWASM.createFromRawInstance(this._rawFullViewingKey.toIvk(scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /** Derives the 32-byte outgoing viewing key for the given scope (default External). */
    toOvk(scope) {
        return this._rawFullViewingKey.toOvk(scope == null ? undefined : valueToShieldedDynamicValue(scope));
    }
    /** The payment address at `diversifierIndex` (default 0) for `scope` (default External). */
    address(diversifierIndex, scope) {
        return OrchardAddressWASM.createFromRawInstance(this._rawFullViewingKey.address(diversifierIndex, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /** The scope `address` was derived under, or null if it does not belong to this key. */
    scopeForAddress(address) {
        return this._rawFullViewingKey.scopeForAddress(address._rawOrchardAddress);
    }
    /** Derives the full viewing key from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
    static fromSeed(seed, coinType, account) {
        return FullViewingKeyWASM.createFromRawInstance(dppProvider.shielded.FullViewingKeyNAPI.fromSeed(seed, coinType, account));
    }
    /** Parses a full viewing key from its 96-byte raw encoding. */
    static fromBytes(bytes) {
        return FullViewingKeyWASM.createFromRawInstance(dppProvider.shielded.FullViewingKeyNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(FullViewingKeyWASM.prototype);
        instance._rawFullViewingKey = rawInstance;
        return instance;
    }
}
