import { PlatformAddressWASM } from '../../Address/PlatformAddress.js';
import { dppProvider } from '../../../provider.js';
export class InputAddressWASM {
    /** @private **/
    _rawInputAddress;
    constructor(address, nonce, credits) {
        this._rawInputAddress = new dppProvider.dpp.InputAddressNAPI(address._rawPlatformAddress, nonce, credits.toString());
    }
    get address() {
        return PlatformAddressWASM.createFromRawInstance(this._rawInputAddress.address);
    }
    set address(value) {
        this._rawInputAddress.address = value._rawPlatformAddress;
    }
    get nonce() {
        return this._rawInputAddress.nonce;
    }
    set nonce(value) {
        this._rawInputAddress.nonce = value;
    }
    get credits() {
        return BigInt(this._rawInputAddress.credits);
    }
    set credits(value) {
        this._rawInputAddress.credits = value.toString();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(InputAddressWASM.prototype);
        instance._rawInputAddress = rawInstance;
        return instance;
    }
}
