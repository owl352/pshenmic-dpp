import { dppProvider } from '../../provider.js';
export class AddressWitnessWASM {
    /** @private **/
    _rawWitness;
    constructor(witness) {
        this._rawWitness = witness;
    }
    P2PKH(signature) {
        return AddressWitnessWASM.createFromRawInstance(dppProvider.dpp.AddressWitnessNAPI.P2PKH(signature));
    }
    P2SH(signatures, redeemScript) {
        return AddressWitnessWASM.createFromRawInstance(dppProvider.dpp.AddressWitnessNAPI.P2SH(signatures, redeemScript));
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
