import type { TokenKeepsHistoryRulesNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class TokenKeepsHistoryRulesWASM {
    /** @private **/
    _rawTokenKeepsHistoryRules: TokenKeepsHistoryRulesNAPI;
    constructor(keepsTransferHistory: boolean, keepsFreezingHistory: boolean, keepsMintingHistory: boolean, keepsBurningHistory: boolean, keepsDirectPricingHistory: boolean, keepsDirectPurchaseHistory: boolean);
    get keepsTransferHistory(): boolean;
    set keepsTransferHistory(keepsTransferHistory: boolean);
    get keepsFreezingHistory(): boolean;
    set keepsFreezingHistory(keepsFreezingHistory: boolean);
    get keepsMintingHistory(): boolean;
    set keepsMintingHistory(keepsMintingHistory: boolean);
    get keepsBurningHistory(): boolean;
    set keepsBurningHistory(keepsBurningHistory: boolean);
    get keepsDirectPricingHistory(): boolean;
    set keepsDirectPricingHistory(keepsDirectPricingHistory: boolean);
    get keepsDirectPurchaseHistory(): boolean;
    set keepsDirectPurchaseHistory(keepsDirectPurchaseHistory: boolean);
    static createFromRawInstance(rawInstance: TokenKeepsHistoryRulesNAPI): TokenKeepsHistoryRulesWASM;
}
