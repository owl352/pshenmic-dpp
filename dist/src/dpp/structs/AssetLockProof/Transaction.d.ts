import type { TransactionNAPI } from '../../../../binaries/bindingsTypes.js';
import { TxInWASM } from './TxIn.js';
import { TxOutWASM } from './TxOut.js';
export declare class TransactionWASM {
    /** @private **/
    _rawTransaction: TransactionNAPI;
    constructor(version: number, lockTime: number | Date, inputs: TxInWASM[], outputs: TxOutWASM[]);
    get version(): number;
    set version(version: number);
    get lockTime(): number;
    set lockTime(lockTime: number | Date);
    get input(): TxInWASM[];
    set input(input: TxInWASM[]);
    get output(): TxOutWASM[];
    set output(output: TxOutWASM[]);
    isCoinBase(): boolean;
    getTxType(): string;
    getTxId(): string;
    static createFromRawInstance(rawInstance: TransactionNAPI): TransactionWASM;
}
