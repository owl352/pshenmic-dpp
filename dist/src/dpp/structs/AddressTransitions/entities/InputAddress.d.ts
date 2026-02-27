import type { InputAddressNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js';
export declare class InputAddressWASM {
    /** @private **/
    _rawInputAddress: InputAddressNAPI;
    constructor(address: PlatformAddressWASM, nonce: number, credits: bigint);
    get address(): PlatformAddressWASM;
    set address(value: PlatformAddressWASM);
    get nonce(): number;
    set nonce(value: number);
    get credits(): bigint;
    set credits(value: bigint);
    static createFromRawInstance(rawInstance: InputAddressNAPI): InputAddressWASM;
}
