import type { OutputAddressNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js';
import { PlatformAddressLike } from '../../../types.js';
export declare class OutputAddressWASM {
    /** @private **/
    _rawOutputAddress: OutputAddressNAPI;
    constructor(address: PlatformAddressLike, credits: bigint);
    get address(): PlatformAddressWASM;
    set address(address: PlatformAddressLike);
    get credits(): bigint;
    set credits(credits: bigint);
    static createFromRawInstance(rawInstance: OutputAddressNAPI): OutputAddressWASM;
}
