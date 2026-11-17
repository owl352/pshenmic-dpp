import { dppProvider } from '../../provider.js';
import { valueToShieldedDynamicValue } from '../../utils.js';
import { OrchardAddressWASM } from './OrchardAddress.js';
/**
 * An Orchard incoming viewing key: it detects and decrypts notes sent to you,
 * but cannot see outgoing notes, tell when a note is spent, or spend it — safe
 * to hand to a watch-only service.
 */
export class IncomingViewingKeyWASM {
    /** @private **/
    _rawIncomingViewingKey;
    /** The 64-byte raw encoding of this key (dk || ivk). */
    bytes() {
        return this._rawIncomingViewingKey.bytes();
    }
    /** The payment address at `diversifierIndex` (default 0); scope is fixed by the key. */
    address(diversifierIndex) {
        return OrchardAddressWASM.createFromRawInstance(this._rawIncomingViewingKey.address(diversifierIndex));
    }
    /** The diversifier index `address` was derived at, or null if it is not from this key. */
    diversifierIndex(address) {
        return this._rawIncomingViewingKey.diversifierIndex(address._rawOrchardAddress);
    }
    /**
     * Derives the incoming viewing key from a BIP-39 seed via ZIP-32
     * (m/32'/coinType'/account') for the given scope (default External).
     */
    static fromSeed(seed, coinType, account, scope) {
        return IncomingViewingKeyWASM.createFromRawInstance(dppProvider.shielded.IncomingViewingKeyNAPI.fromSeed(seed, coinType, account, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /** Derives the incoming viewing key from a full viewing key (default External scope). */
    static fromFullViewingKey(fullViewingKey, scope) {
        return IncomingViewingKeyWASM.createFromRawInstance(dppProvider.shielded.IncomingViewingKeyNAPI.fromFullViewingKey(fullViewingKey._rawFullViewingKey, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /** Parses an incoming viewing key from its 64-byte raw encoding. */
    static fromBytes(bytes) {
        return IncomingViewingKeyWASM.createFromRawInstance(dppProvider.shielded.IncomingViewingKeyNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IncomingViewingKeyWASM.prototype);
        instance._rawIncomingViewingKey = rawInstance;
        return instance;
    }
}
