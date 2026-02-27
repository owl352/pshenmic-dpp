import type { TokenSetPriceForDirectPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenPricingScheduleWASM } from '../TokenPricingSchedule.js';
export declare class TokenSetPriceForDirectPurchaseTransitionWASM {
    /** @private **/
    _rawTransition: TokenSetPriceForDirectPurchaseTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, prices?: TokenPricingScheduleWASM, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get price(): TokenPricingScheduleWASM | undefined;
    set price(value: TokenPricingScheduleWASM | undefined);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenSetPriceForDirectPurchaseTransitionNAPI): TokenSetPriceForDirectPurchaseTransitionWASM;
}
