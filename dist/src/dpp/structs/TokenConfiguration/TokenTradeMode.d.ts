import type { TokenTradeModeNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class TokenTradeModeWASM {
    /** @private **/
    _rawTokenTradeMode: TokenTradeModeNAPI;
    private constructor();
    getValue(): string;
    static NotTradeable(): TokenTradeModeWASM;
    static createFromRawInstance(rawInstance: TokenTradeModeNAPI): TokenTradeModeWASM;
}
