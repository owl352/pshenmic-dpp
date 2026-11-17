import type { TokenPricingScheduleNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class TokenPricingScheduleWASM {
    /** @private **/
    _rawTokenPricingSchedule: TokenPricingScheduleNAPI;
    constructor(prices: bigint | {
        [key: string]: bigint;
    });
    getScheduleType(): string;
    getValue(): bigint | {
        [key: string]: string;
    };
    static SinglePrice(prices: bigint): TokenPricingScheduleWASM;
    static SetPrices(prices: {
        [key: string]: bigint;
    }): TokenPricingScheduleWASM;
    static createFromRawInstance(rawInstance: TokenPricingScheduleNAPI): TokenPricingScheduleWASM;
}
