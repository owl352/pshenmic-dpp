import type { PlatformAddressNAPI } from '../../../../binaries/bindingsTypes.js';
import { NetworkLike } from '../../types.js';
export declare class PlatformAddressWASM {
    /** @private **/
    _rawPlatformAddress: PlatformAddressNAPI;
    constructor(address: Uint8Array);
    bytes(): Uint8Array;
    toAddress(network: NetworkLike): string;
    toBech32m(network: NetworkLike): string;
    isP2PKH(): boolean;
    isP2SH(): boolean;
    hash(): Uint8Array;
    static createFromRawInstance(rawInstance: PlatformAddressNAPI): PlatformAddressWASM;
}
