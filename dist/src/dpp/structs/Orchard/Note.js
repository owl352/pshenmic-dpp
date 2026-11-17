import { dppProvider } from '../../provider.js';
import { OrchardAddressWASM } from './OrchardAddress.js';
export class NoteWASM {
    /** @private **/
    _rawNote;
    constructor(address, value, rho, rseed) {
        this._rawNote = new dppProvider.shielded.NoteNAPI(address._rawOrchardAddress, value.toString(), rho, rseed);
    }
    get address() {
        return OrchardAddressWASM.createFromRawInstance(this._rawNote.address);
    }
    set address(value) {
        this._rawNote.address = value._rawOrchardAddress;
    }
    get value() {
        return BigInt(this._rawNote.value);
    }
    set value(value) {
        this._rawNote.value = value.toString();
    }
    get rho() {
        return this._rawNote.rho;
    }
    set rho(value) {
        this._rawNote.rho = value;
    }
    get rseed() {
        return this._rawNote.rseed;
    }
    set rseed(value) {
        this._rawNote.rseed = value;
    }
    /** The note commitment (cmx, 32 bytes) — its leaf in the commitment tree. */
    get cmx() {
        return this._rawNote.cmx;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(NoteWASM.prototype);
        instance._rawNote = rawInstance;
        return instance;
    }
}
