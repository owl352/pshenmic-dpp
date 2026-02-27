import type { TxInNAPI } from '../../../../binaries/bindingsTypes.js';
import { OutPointWASM } from './OutPoint.js';
import { WitnessWASM } from './Witness.js';
export declare class TxInWASM {
    /** @private **/
    _rawTxIn: TxInNAPI;
    constructor(previousOutPoint: OutPointWASM, scriptSig: Uint8Array, sequency: number, witness: WitnessWASM);
    get previousOutput(): OutPointWASM;
    set previousOutput(previousOutput: OutPointWASM);
    get scriptSig(): Uint8Array;
    set scriptSig(sig: Uint8Array);
    get sequence(): number;
    set sequence(sequence: number);
    get witnesses(): WitnessWASM;
    set witnesses(witness: WitnessWASM);
    static createFromRawInstance(rawInstance: TxInNAPI): TxInWASM;
}
