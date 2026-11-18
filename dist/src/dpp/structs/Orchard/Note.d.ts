import type { NoteNAPI } from 'dash-platform-shielded/bindingsTypes';
import { ShieldedAddressWASM } from './ShieldedAddress.js';
export declare class NoteWASM {
    /** @private **/
    _rawNote: NoteNAPI;
    constructor(address: ShieldedAddressWASM, value: bigint, rho: Uint8Array, rseed: Uint8Array);
    get address(): ShieldedAddressWASM;
    set address(value: ShieldedAddressWASM);
    get value(): bigint;
    set value(value: bigint);
    get rho(): Uint8Array;
    set rho(value: Uint8Array);
    get rseed(): Uint8Array;
    set rseed(value: Uint8Array);
    /** The note commitment (cmx, 32 bytes) — its leaf in the commitment tree. */
    get cmx(): Uint8Array;
    static createFromRawInstance(rawInstance: NoteNAPI): NoteWASM;
}
