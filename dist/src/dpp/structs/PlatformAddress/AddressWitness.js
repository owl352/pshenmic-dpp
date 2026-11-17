import { dppProvider } from '../../provider.js';
export class AddressWitnessWASM {
    /** @private **/
    _rawWitness;
    constructor(witness) {
        this._rawWitness = witness;
    }
    static P2PKH(signature) {
        return AddressWitnessWASM.createFromRawInstance(dppProvider.dpp.AddressWitnessNAPI.P2PKH(signature));
    }
    static P2SH(signatures, redeemScript) {
        return AddressWitnessWASM.createFromRawInstance(dppProvider.dpp.AddressWitnessNAPI.P2SH(signatures, redeemScript));
    }
    bytes() {
        return this._rawWitness.bytes();
    }
    static fromBytes(bytes) {
        return AddressWitnessWASM.createFromRawInstance(dppProvider.dpp.AddressWitnessNAPI.fromBytes(bytes));
    }
    getType() {
        return this._rawWitness.getType();
    }
    getValue() {
        return this._rawWitness.getValue();
    }
    static createFromRawInstance(rawInstance) {
        return new AddressWitnessWASM(rawInstance);
    }
}
