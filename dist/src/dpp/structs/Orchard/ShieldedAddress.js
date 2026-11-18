import { dppProvider } from '../../provider.js';
import { valueToShieldedDynamicValue } from '../../utils.js';
export class ShieldedAddressWASM {
    /** @private **/
    _rawShieldedAddress;
    toBech32m(network) {
        return this._rawShieldedAddress.toBech32m(valueToShieldedDynamicValue(network));
    }
    bytes() {
        return this._rawShieldedAddress.bytes();
    }
    static fromBech32m(bech32m) {
        return ShieldedAddressWASM.createFromRawInstance(dppProvider.shielded.ShieldedAddressNAPI.fromBech32m(bech32m));
    }
    static fromBytes(bytes) {
        return ShieldedAddressWASM.createFromRawInstance(dppProvider.shielded.ShieldedAddressNAPI.fromBytes(bytes));
    }
    /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
    static fromSeed(seed, coinType, account, diversifierIndex, scope) {
        return ShieldedAddressWASM.createFromRawInstance(dppProvider.shielded.ShieldedAddressNAPI.fromSeed(seed, coinType, account, diversifierIndex, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /**
     * Derives the address at `diversifierIndex` (default 0) from a full viewing
     * key, for `scope` (default External).
     */
    static fromFullViewingKey(fullViewingKey, diversifierIndex, scope) {
        return ShieldedAddressWASM.createFromRawInstance(dppProvider.shielded.ShieldedAddressNAPI.fromFullViewingKey(fullViewingKey._rawFullViewingKey, diversifierIndex, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /**
     * Derives the address at `diversifierIndex` (default 0) from an incoming
     * viewing key. The scope is fixed by the key itself.
     */
    static fromIncomingViewingKey(incomingViewingKey, diversifierIndex) {
        return ShieldedAddressWASM.createFromRawInstance(dppProvider.shielded.ShieldedAddressNAPI.fromIncomingViewingKey(incomingViewingKey._rawIncomingViewingKey, diversifierIndex));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedAddressWASM.prototype);
        instance._rawShieldedAddress = rawInstance;
        return instance;
    }
}
/** Derives the sender's shielded outgoing viewing key (32 bytes) from a BIP-39 seed. */
export function shieldedOvkFromSeed(seed, coinType, account) {
    return dppProvider.shielded.shieldedOvkFromSeed(seed, coinType, account);
}
