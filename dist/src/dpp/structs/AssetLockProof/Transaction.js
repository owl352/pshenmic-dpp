import { TxInWASM } from './TxIn.js';
import { TxOutWASM } from './TxOut.js';
import { dppProvider } from '../../provider.js';
export class TransactionWASM {
    /** @private **/
    _rawTransaction;
    constructor(version, lockTime, inputs, outputs) {
        const normalLockTime = typeof lockTime === 'number' ? lockTime : lockTime.getTime();
        this._rawTransaction = new dppProvider.dpp.TransactionNAPI(version, normalLockTime, inputs.map(input => input._rawTxIn), outputs.map(output => output._rawTxOut));
    }
    get version() {
        return this._rawTransaction.version;
    }
    set version(version) {
        this._rawTransaction.version = version;
    }
    get lockTime() {
        return this._rawTransaction.lockTime;
    }
    set lockTime(lockTime) {
        this._rawTransaction.lockTime = typeof lockTime === 'number' ? lockTime : lockTime.getTime();
    }
    get input() {
        return this._rawTransaction.input.map(TxInWASM.createFromRawInstance);
    }
    set input(input) {
        this._rawTransaction.input = input.map(input => input._rawTxIn);
    }
    get output() {
        return this._rawTransaction.output.map(TxOutWASM.createFromRawInstance);
    }
    set output(output) {
        this._rawTransaction.output = output.map(output => output._rawTxOut);
    }
    isCoinBase() {
        return this._rawTransaction.isCoinBase();
    }
    getTxType() {
        return this._rawTransaction.getTxType();
    }
    getTxId() {
        return this._rawTransaction.getTxId();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TransactionWASM.prototype);
        instance._rawTransaction = rawInstance;
        return instance;
    }
}
