import { dppProvider } from '../../provider.js';
import { valueFromDynamicValue, valueToDynamicValue } from '../../utils.js';
export class TokenPricingScheduleWASM {
    /** @private **/
    _rawTokenPricingSchedule;
    constructor(prices) {
        if (typeof prices === 'bigint') {
            return TokenPricingScheduleWASM.SinglePrice(prices);
        }
        else {
            return TokenPricingScheduleWASM.SetPrices(prices);
        }
    }
    getScheduleType() {
        return this._rawTokenPricingSchedule.getScheduleType();
    }
    getValue() {
        const value = this._rawTokenPricingSchedule.getValue();
        if (typeof value === 'string') {
            return BigInt(value);
        }
        else {
            const normalValue = valueFromDynamicValue(value);
            for (const key of Object.keys(normalValue)) {
                normalValue[key] = BigInt(normalValue[key]);
            }
            return normalValue;
        }
    }
    static SinglePrice(prices) {
        return TokenPricingScheduleWASM.createFromRawInstance(dppProvider.dpp.TokenPricingScheduleNAPI.SinglePrice(prices.toString()));
    }
    static SetPrices(prices) {
        return TokenPricingScheduleWASM.createFromRawInstance(dppProvider.dpp.TokenPricingScheduleNAPI.SetPrices(valueToDynamicValue(prices)));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenPricingScheduleWASM.prototype);
        instance._rawTokenPricingSchedule = rawInstance;
        return instance;
    }
}
