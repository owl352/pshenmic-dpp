import type { OutputAddressNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js';
export declare class OutputAddressWASM {
    /** @private **/
    _rawOutputAddress: OutputAddressNAPI;
    constructor(address: PlatformAddressWASM, credits: bigint);
    get address(): PlatformAddressWASM;
    set address(address: PlatformAddressWASM);
    get credits(): bigint;
    set credits(credits: bigint);
    static createFromRawInstance(rawInstance: OutputAddressNAPI): OutputAddressWASM;
}
