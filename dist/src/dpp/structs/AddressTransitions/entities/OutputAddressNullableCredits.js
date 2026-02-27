import { PlatformAddressWASM } from '../../Address/PlatformAddress.js';
import { dppProvider } from '../../../provider.js';
export class OutputAddressNullableCreditsWASM {
    /** @private **/
    _rawOutputAddressNullableCredits;
    constructor(address, credits) {
        this._rawOutputAddressNullableCredits = new dppProvider.dpp.OutputAddressNullableCreditsNAPI(address._rawPlatformAddress, credits?.toString());
    }
    get address() {
        return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddressNullableCredits.address);
    }
    set address(address) {
        this._rawOutputAddressNullableCredits.address = address._rawPlatformAddress;
    }
    get credits() {
        const credits = this._rawOutputAddressNullableCredits.credits;
        if (credits != null) {
            return BigInt(credits);
        }
    }
    set credits(value) {
        this._rawOutputAddressNullableCredits.credits = value?.toString();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(OutputAddressNullableCreditsWASM.prototype);
        instance._rawOutputAddressNullableCredits = rawInstance;
        return instance;
    }
}
