import { OutPointWASM } from './OutPoint.js';
import { WitnessWASM } from './Witness.js';
import { dppProvider } from '../../provider.js';
export class TxInWASM {
    /** @private **/
    _rawTxIn;
    constructor(previousOutPoint, scriptSig, sequency, witness) {
        this._rawTxIn = new dppProvider.dpp.TxInNAPI(previousOutPoint._rawOutPoint, scriptSig, sequency, witness._rawWitness);
    }
    get previousOutput() {
        return OutPointWASM.createFromRawInstance(this._rawTxIn.previousOutput);
    }
    set previousOutput(previousOutput) {
        this._rawTxIn.previousOutput = previousOutput._rawOutPoint;
    }
    get scriptSig() {
        return this._rawTxIn.scriptSig;
    }
    set scriptSig(sig) {
        this._rawTxIn.scriptSig = sig;
    }
    get sequence() {
        return this._rawTxIn.sequence;
    }
    set sequence(sequence) {
        this._rawTxIn.sequence = sequence;
    }
    get witnesses() {
        return WitnessWASM.createFromRawInstance(this._rawTxIn.witnesses);
    }
    set witnesses(witness) {
        this._rawTxIn.witnesses = witness._rawWitness;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TxInWASM.prototype);
        instance._rawTxIn = rawInstance;
        return instance;
    }
}
