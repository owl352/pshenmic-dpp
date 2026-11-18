import type { ShieldedOutputNAPI } from 'dash-platform-shielded/bindingsTypes';
import { OrchardAddressWASM } from './OrchardAddress.js';
import { ShieldedMemoWASM } from './ShieldedMemo.js';
/**
 * One output of a multi-output shielded transfer (`shieldedTransferMulti`):
 * who receives the note, how much, and the memo carried inside it.
 *
 * Each output holds its own memo — the single-recipient builders share one memo
 * across the bundle, which has nothing sensible to say when there are several
 * unrelated recipients.
 */
export declare class ShieldedOutputWASM {
    /** @private **/
    _rawShieldedOutput: ShieldedOutputNAPI;
    constructor(address: OrchardAddressWASM, amount: bigint, memo: ShieldedMemoWASM);
    get address(): OrchardAddressWASM;
    set address(value: OrchardAddressWASM);
    get amount(): bigint;
    set amount(value: bigint);
    get memo(): ShieldedMemoWASM;
    set memo(value: ShieldedMemoWASM);
    static createFromRawInstance(rawInstance: ShieldedOutputNAPI): ShieldedOutputWASM;
}
