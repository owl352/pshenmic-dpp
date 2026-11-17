import { dppProvider } from '../../provider.js';
import { valueToShieldedDynamicValue } from '../../utils.js';
export class OrchardAddressWASM {
    /** @private **/
    _rawOrchardAddress;
    toBech32m(network) {
        return this._rawOrchardAddress.toBech32m(valueToShieldedDynamicValue(network));
    }
    bytes() {
        return this._rawOrchardAddress.bytes();
    }
    static fromBech32m(bech32m) {
        return OrchardAddressWASM.createFromRawInstance(dppProvider.shielded.OrchardAddressNAPI.fromBech32m(bech32m));
    }
    static fromBytes(bytes) {
        return OrchardAddressWASM.createFromRawInstance(dppProvider.shielded.OrchardAddressNAPI.fromBytes(bytes));
    }
    /** Derives the address from a BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). */
    static fromSeed(seed, coinType, account, diversifierIndex, scope) {
        return OrchardAddressWASM.createFromRawInstance(dppProvider.shielded.OrchardAddressNAPI.fromSeed(seed, coinType, account, diversifierIndex, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /**
     * Derives the address at `diversifierIndex` (default 0) from a full viewing
     * key, for `scope` (default External).
     */
    static fromFullViewingKey(fullViewingKey, diversifierIndex, scope) {
        return OrchardAddressWASM.createFromRawInstance(dppProvider.shielded.OrchardAddressNAPI.fromFullViewingKey(fullViewingKey._rawFullViewingKey, diversifierIndex, scope == null ? undefined : valueToShieldedDynamicValue(scope)));
    }
    /**
     * Derives the address at `diversifierIndex` (default 0) from an incoming
     * viewing key. The scope is fixed by the key itself.
     */
    static fromIncomingViewingKey(incomingViewingKey, diversifierIndex) {
        return OrchardAddressWASM.createFromRawInstance(dppProvider.shielded.OrchardAddressNAPI.fromIncomingViewingKey(incomingViewingKey._rawIncomingViewingKey, diversifierIndex));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(OrchardAddressWASM.prototype);
        instance._rawOrchardAddress = rawInstance;
        return instance;
    }
}
/** Derives the sender's Orchard outgoing viewing key (32 bytes) from a BIP-39 seed. */
export function orchardOvkFromSeed(seed, coinType, account) {
    return dppProvider.shielded.orchardOvkFromSeed(seed, coinType, account);
}
