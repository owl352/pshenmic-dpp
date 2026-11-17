import { dppProvider } from '../../provider.js';
export class ShieldedMemoWASM {
    /** @private **/
    _rawShieldedMemo;
    toString() {
        return this._rawShieldedMemo.toString();
    }
    toBytes() {
        return this._rawShieldedMemo.toBytes();
    }
    static empty() {
        return ShieldedMemoWASM.createFromRawInstance(dppProvider.dpp.ShieldedMemoNAPI.empty());
    }
    static fromString(value) {
        return ShieldedMemoWASM.createFromRawInstance(dppProvider.dpp.ShieldedMemoNAPI.fromString(value));
    }
    static other(kind, payload) {
        return ShieldedMemoWASM.createFromRawInstance(dppProvider.dpp.ShieldedMemoNAPI.other(kind, payload));
    }
    static fromBytes(bytes) {
        return ShieldedMemoWASM.createFromRawInstance(dppProvider.dpp.ShieldedMemoNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedMemoWASM.prototype);
        instance._rawShieldedMemo = rawInstance;
        return instance;
    }
}
