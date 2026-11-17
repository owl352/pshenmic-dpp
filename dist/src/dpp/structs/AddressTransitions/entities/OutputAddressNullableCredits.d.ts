import type { OutputAddressNullableCreditsNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js';
import { PlatformAddressLike } from '../../../types.js';
export declare class OutputAddressNullableCreditsWASM {
    /** @private **/
    _rawOutputAddressNullableCredits: OutputAddressNullableCreditsNAPI;
    constructor(address: PlatformAddressLike, credits?: bigint);
    get address(): PlatformAddressWASM;
    set address(address: PlatformAddressLike);
    get credits(): BigInt | undefined;
    set credits(value: BigInt | undefined);
    static createFromRawInstance(rawInstance: OutputAddressNullableCreditsNAPI): OutputAddressNullableCreditsWASM;
}
