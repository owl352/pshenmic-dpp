import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js';
import { dppProvider } from '../../../provider.js';
import { preparePlatformAddressValue } from '../../../utils.js';
export class InputAddressWASM {
    /** @private **/
    _rawInputAddress;
    constructor(address, nonce, credits) {
        this._rawInputAddress = new dppProvider.dpp.InputAddressNAPI(preparePlatformAddressValue(address), nonce, credits.toString());
    }
    bytes() {
        return this._rawInputAddress.bytes();
    }
    static fromBytes(bytes) {
        return InputAddressWASM.createFromRawInstance(dppProvider.dpp.InputAddressNAPI.fromBytes(bytes));
    }
    get address() {
        return PlatformAddressWASM.createFromRawInstance(this._rawInputAddress.address);
    }
    set address(value) {
        this._rawInputAddress.address = preparePlatformAddressValue(value);
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
