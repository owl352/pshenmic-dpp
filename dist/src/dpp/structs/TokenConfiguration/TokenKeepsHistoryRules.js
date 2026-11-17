import { dppProvider } from '../../provider.js';
export class TokenKeepsHistoryRulesWASM {
    /** @private **/
    _rawTokenKeepsHistoryRules;
    constructor(keepsTransferHistory, keepsFreezingHistory, keepsMintingHistory, keepsBurningHistory, keepsDirectPricingHistory, keepsDirectPurchaseHistory) {
        this._rawTokenKeepsHistoryRules = new dppProvider.dpp.TokenKeepsHistoryRulesNAPI(keepsTransferHistory, keepsFreezingHistory, keepsMintingHistory, keepsBurningHistory, keepsDirectPricingHistory, keepsDirectPurchaseHistory);
    }
    get keepsTransferHistory() {
        return this._rawTokenKeepsHistoryRules.keepsTransferHistory;
    }
    set keepsTransferHistory(keepsTransferHistory) {
        this._rawTokenKeepsHistoryRules.keepsTransferHistory = keepsTransferHistory;
    }
    get keepsFreezingHistory() {
        return this._rawTokenKeepsHistoryRules.keepsFreezingHistory;
    }
    set keepsFreezingHistory(keepsFreezingHistory) {
        this._rawTokenKeepsHistoryRules.keepsFreezingHistory = keepsFreezingHistory;
    }
    get keepsMintingHistory() {
        return this._rawTokenKeepsHistoryRules.keepsMintingHistory;
    }
    set keepsMintingHistory(keepsMintingHistory) {
        this._rawTokenKeepsHistoryRules.keepsMintingHistory = keepsMintingHistory;
    }
    get keepsBurningHistory() {
        return this._rawTokenKeepsHistoryRules.keepsBurningHistory;
    }
    set keepsBurningHistory(keepsBurningHistory) {
        this._rawTokenKeepsHistoryRules.keepsBurningHistory = keepsBurningHistory;
    }
    get keepsDirectPricingHistory() {
        return this._rawTokenKeepsHistoryRules.keepsDirectPricingHistory;
    }
    set keepsDirectPricingHistory(keepsDirectPricingHistory) {
        this._rawTokenKeepsHistoryRules.keepsDirectPricingHistory = keepsDirectPricingHistory;
    }
    get keepsDirectPurchaseHistory() {
        return this._rawTokenKeepsHistoryRules.keepsDirectPurchaseHistory;
    }
    set keepsDirectPurchaseHistory(keepsDirectPurchaseHistory) {
        this._rawTokenKeepsHistoryRules.keepsDirectPurchaseHistory = keepsDirectPurchaseHistory;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenKeepsHistoryRulesWASM.prototype);
        instance._rawTokenKeepsHistoryRules = rawInstance;
        return instance;
    }
}
