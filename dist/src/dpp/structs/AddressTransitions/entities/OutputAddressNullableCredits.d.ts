import type { OutputAddressNullableCreditsNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js';
export declare class OutputAddressNullableCreditsWASM {
    /** @private **/
    _rawOutputAddressNullableCredits: OutputAddressNullableCreditsNAPI;
    constructor(address: PlatformAddressWASM, credits?: bigint);
    get address(): PlatformAddressWASM;
    set address(address: PlatformAddressWASM);
    get credits(): BigInt | undefined;
    set credits(value: BigInt | undefined);
    static createFromRawInstance(rawInstance: OutputAddressNullableCreditsNAPI): OutputAddressNullableCreditsWASM;
}
