import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
export class TokenBurnTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, burnAmount, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenBurnTransitionNAPI(base._rawTokenBaseTransition, burnAmount.toString(), publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get burnAmount() {
        return BigInt(this._rawTransition.burnAmount);
    }
    set burnAmount(value) {
        this._rawTransition.burnAmount = value.toString();
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenBurnTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
