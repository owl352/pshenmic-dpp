import { TokenTradeModeWASM } from './TokenTradeMode.js';
import { ChangeControlRulesWASM } from './ChangeControlRules.js';
import { dppProvider } from '../../provider.js';
export class TokenMarketplaceRulesWASM {
    /** @private **/
    _rawTokenMarketplaceRules;
    constructor(tradeMode, tradeModeChangeRules) {
        this._rawTokenMarketplaceRules = new dppProvider.dpp.TokenMarketplaceRulesNAPI(tradeMode._rawTokenTradeMode, tradeModeChangeRules._rawChangeControlRules);
    }
    get tradeMode() {
        return TokenTradeModeWASM.createFromRawInstance(this._rawTokenMarketplaceRules.tradeMode);
    }
    set tradeMode(value) {
        this._rawTokenMarketplaceRules.tradeMode = value._rawTokenTradeMode;
    }
    get tradeModeChangeRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenMarketplaceRules.tradeModeChangeRules);
    }
    set tradeModeChangeRules(value) {
        this._rawTokenMarketplaceRules.tradeModeChangeRules = value._rawChangeControlRules;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenMarketplaceRulesWASM.prototype);
        instance._rawTokenMarketplaceRules = rawInstance;
        return instance;
    }
}
