import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
export class TokenDirectPurchaseTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, tokenCount, totalAgreedPrice) {
        this._rawTransition = new dppProvider.dpp.TokenDirectPurchaseTransitionNAPI(base._rawTokenBaseTransition, tokenCount.toString(), totalAgreedPrice.toString());
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get tokenCount() {
        return BigInt(this._rawTransition.tokenCount);
    }
    set tokenCount(value) {
        this._rawTransition.tokenCount = value.toString();
    }
    get totalAgreedPrice() {
        return BigInt(this._rawTransition.totalAgreedPrice);
    }
    set totalAgreedPrice(value) {
        this._rawTransition.totalAgreedPrice = value.toString();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenDirectPurchaseTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
