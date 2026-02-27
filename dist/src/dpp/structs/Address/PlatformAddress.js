import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
export class PlatformAddressWASM {
    /** @private **/
    _rawPlatformAddress;
    constructor(address) {
        this._rawPlatformAddress = new dppProvider.dpp.PlatformAddressNAPI(address);
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
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PlatformAddressWASM.prototype);
        instance._rawPlatformAddress = rawInstance;
        return instance;
    }
}
