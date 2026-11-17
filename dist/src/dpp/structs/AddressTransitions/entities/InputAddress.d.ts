import type { InputAddressNAPI } from '../../../../../binaries/bindingsTypes.js';
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js';
import { PlatformAddressLike } from '../../../types.js';
export declare class InputAddressWASM {
    /** @private **/
    _rawInputAddress: InputAddressNAPI;
    constructor(address: PlatformAddressLike, nonce: number, credits: bigint);
    bytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): InputAddressWASM;
    get address(): PlatformAddressWASM;
    set address(value: PlatformAddressLike);
    get nonce(): number;
    set nonce(value: number);
    get credits(): bigint;
    set credits(value: bigint);
    static createFromRawInstance(rawInstance: InputAddressNAPI): InputAddressWASM;
}
