import type { PlatformAddressNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js';
import { NetworkLike, PlatformAddressLike } from '../../types.js';
export declare class PlatformAddressWASM {
    /** @private **/
    _rawPlatformAddress: PlatformAddressNAPI;
    constructor(address: PlatformAddressLike);
    bytes(): Uint8Array;
    toAddress(network: NetworkLike): string;
    toBech32m(network: NetworkLike): string;
    isP2PKH(): boolean;
    isP2SH(): boolean;
    hash(): Uint8Array;
    /**
     * Storage fee charged for creating balance entries for addresses that are not in state yet.
     *
     * A minimum fee prices every output as a fresh address, but the fee actually charged is
     * metered: paying an address that already exists adds no bytes, while each address created
     * costs this much storage on top of processing.
     */
    static estimateStorageFeeForNewAddresses(addressCount: number, platformVersion?: PlatformVersionNAPI): bigint;
    static fromBech32m(bech32m: string): PlatformAddressWASM;
    static fromBytes(bytes: Uint8Array): PlatformAddressWASM;
    static createFromRawInstance(rawInstance: PlatformAddressNAPI): PlatformAddressWASM;
}
