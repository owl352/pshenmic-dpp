import { dppProvider } from '../../provider.js';
import { preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js';
export class PlatformAddressWASM {
    /** @private **/
    _rawPlatformAddress;
    constructor(address) {
        this._rawPlatformAddress = new dppProvider.dpp.PlatformAddressNAPI(preparePlatformAddressValue(address));
    }
    bytes() {
        return this._rawPlatformAddress.bytes();
    }
    toAddress(network) {
        return this._rawPlatformAddress.toAddress(valueToDynamicValue(network));
    }
    toBech32m(network) {
        return this._rawPlatformAddress.toBech32m(valueToDynamicValue(network));
    }
    isP2PKH() {
        return this._rawPlatformAddress.isP2PKH();
    }
    isP2SH() {
        return this._rawPlatformAddress.isP2SH();
    }
    hash() {
        return this._rawPlatformAddress.hash();
    }
    /**
     * Storage fee charged for creating balance entries for addresses that are not in state yet.
     *
     * A minimum fee prices every output as a fresh address, but the fee actually charged is
     * metered: paying an address that already exists adds no bytes, while each address created
     * costs this much storage on top of processing.
     */
    static estimateStorageFeeForNewAddresses(addressCount, platformVersion) {
        return BigInt(dppProvider.dpp.PlatformAddressNAPI.estimateStorageFeeForNewAddresses(addressCount, platformVersion));
    }
    static fromBech32m(bech32m) {
        return PlatformAddressWASM.createFromRawInstance(dppProvider.dpp.PlatformAddressNAPI.fromBech32m(bech32m));
    }
    static fromBytes(bytes) {
        return PlatformAddressWASM.createFromRawInstance(dppProvider.dpp.PlatformAddressNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PlatformAddressWASM.prototype);
        instance._rawPlatformAddress = rawInstance;
        return instance;
    }
}
