import { dppProvider } from '../../provider.js';
export class TokenTradeModeWASM {
    /** @private **/
    _rawTokenTradeMode;
    constructor(rawInstance) {
        this._rawTokenTradeMode = rawInstance;
    }
    getValue() {
        return this._rawTokenTradeMode.getValue();
    }
    static NotTradeable() {
        return TokenTradeModeWASM.createFromRawInstance(dppProvider.dpp.TokenTradeModeNAPI.NotTradeable());
    }
    static createFromRawInstance(rawInstance) {
        return new TokenTradeModeWASM(rawInstance);
    }
}
