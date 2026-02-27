import { dppProvider } from '../../provider.js';
export class WitnessWASM {
    /** @private **/
    _rawWitness;
    constructor(bytes) {
        this._rawWitness = new dppProvider.dpp.WitnessNAPI(bytes);
    }
    getBytes() {
        return this._rawWitness.getBytes();
    }
    isEmpty() {
        return this._rawWitness.isEmpty();
    }
    clear() {
        this._rawWitness.clear();
    }
    push(value) {
        this._rawWitness.push(value);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(WitnessWASM.prototype);
        instance._rawWitness = rawInstance;
        return instance;
    }
}
