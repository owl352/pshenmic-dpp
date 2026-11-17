import type { TokenMarketplaceRulesNAPI } from '../../../../binaries/bindingsTypes.js';
import { TokenTradeModeWASM } from './TokenTradeMode.js';
import { ChangeControlRulesWASM } from './ChangeControlRules.js';
export declare class TokenMarketplaceRulesWASM {
    /** @private **/
    _rawTokenMarketplaceRules: TokenMarketplaceRulesNAPI;
    constructor(tradeMode: TokenTradeModeWASM, tradeModeChangeRules: ChangeControlRulesWASM);
    get tradeMode(): TokenTradeModeWASM;
    set tradeMode(value: TokenTradeModeWASM);
    get tradeModeChangeRules(): ChangeControlRulesWASM;
    set tradeModeChangeRules(value: ChangeControlRulesWASM);
    static createFromRawInstance(rawInstance: TokenMarketplaceRulesNAPI): TokenMarketplaceRulesWASM;
}
