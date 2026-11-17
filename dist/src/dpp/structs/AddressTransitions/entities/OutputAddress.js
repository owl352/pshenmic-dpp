import { dppProvider } from '../../../provider.js';
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js';
import { preparePlatformAddressValue } from '../../../utils.js';
export class OutputAddressWASM {
    /** @private **/
    _rawOutputAddress;
    constructor(address, credits) {
        this._rawOutputAddress = new dppProvider.dpp.OutputAddressNAPI(preparePlatformAddressValue(address), credits.toString());
    }
    get address() {
        return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddress.address);
    }
    set address(address) {
        this._rawOutputAddress.address = preparePlatformAddressValue(address);
    }
    get credits() {
        return BigInt(this._rawOutputAddress.credits);
    }
    set credits(credits) {
        this._rawOutputAddress.credits = credits.toString();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(OutputAddressWASM.prototype);
        instance._rawOutputAddress = rawInstance;
        return instance;
    }
}
