import { dppProvider } from '../../provider.js';
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
export class ShieldedOutputWASM {
    /** @private **/
    _rawShieldedOutput;
    constructor(address, amount, memo) {
        // The memo is base-kept: it crosses into the shielded instance as bytes,
        // never as a wrapped napi object (per-Env wrap maps don't share).
        this._rawShieldedOutput = new dppProvider.shielded.ShieldedOutputNAPI(address._rawOrchardAddress, amount.toString(), memo.toBytes());
    }
    get address() {
        return OrchardAddressWASM.createFromRawInstance(this._rawShieldedOutput.address);
    }
    set address(value) {
        this._rawShieldedOutput.address = value._rawOrchardAddress;
    }
    get amount() {
        return BigInt(this._rawShieldedOutput.amount);
    }
    set amount(value) {
        this._rawShieldedOutput.amount = value.toString();
    }
    get memo() {
        // The getter returns bytes from the shielded instance; re-wrap them into
        // a base-typed memo so the result never carries a shielded-instance raw.
        return ShieldedMemoWASM.fromBytes(this._rawShieldedOutput.memo);
    }
    set memo(value) {
        this._rawShieldedOutput.memo = value.toBytes();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedOutputWASM.prototype);
        instance._rawShieldedOutput = rawInstance;
        return instance;
    }
}
