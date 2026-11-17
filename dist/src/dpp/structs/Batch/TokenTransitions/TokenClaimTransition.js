import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
import { valueToDynamicValue } from '../../../utils.js';
export class TokenClaimTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, distributionType, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenClaimTransitionNAPI(base._rawTokenBaseTransition, valueToDynamicValue(distributionType), publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get distributionType() {
        return this._rawTransition.distributionType;
    }
    set distributionType(value) {
        this._rawTransition.distributionType = valueToDynamicValue(value);
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenClaimTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
