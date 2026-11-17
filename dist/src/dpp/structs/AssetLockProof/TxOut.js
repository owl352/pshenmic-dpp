import { dppProvider } from '../../provider.js';
export class TxOutWASM {
    _rawTxOut;
    constructor(value, scriptPubKey) {
        const rsValue = value.toString();
        this._rawTxOut = new dppProvider.dpp.TxOutNAPI(rsValue, scriptPubKey);
    }
    get value() {
        return BigInt(this._rawTxOut.value);
    }
    set value(value) {
        this._rawTxOut.value = value.toString();
    }
    get scriptPubKeyHex() {
        return this._rawTxOut.scriptPubKeyHex;
    }
    set scriptPubKeyHex(script) {
        this._rawTxOut.scriptPubKeyHex = script;
    }
    get scriptPubKeyBytes() {
        return this._rawTxOut.scriptPubKeyBytes;
    }
    set scriptPubKeyBytes(script) {
        this._rawTxOut.scriptPubKeyBytes = script;
    }
    getScriptPubKeyASM() {
        return this._rawTxOut.getScriptPubKeyASM();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TxOutWASM.prototype);
        instance._rawTxOut = rawInstance;
        return instance;
    }
}
