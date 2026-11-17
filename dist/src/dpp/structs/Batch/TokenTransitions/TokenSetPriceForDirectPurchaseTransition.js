import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenPricingScheduleWASM } from '../TokenPricingSchedule.js';
import { dppProvider } from '../../../provider.js';
export class TokenSetPriceForDirectPurchaseTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, prices, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenSetPriceForDirectPurchaseTransitionNAPI(base._rawTokenBaseTransition, prices?._rawTokenPricingSchedule, publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get price() {
        const price = this._rawTransition.price;
        if (price != null) {
            return TokenPricingScheduleWASM.createFromRawInstance(price);
        }
    }
    set price(value) {
        this._rawTransition.price = value?._rawTokenPricingSchedule;
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenSetPriceForDirectPurchaseTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
