import type { TokenConfigurationConventionNAPI } from '../../../../binaries/bindingsTypes.js';
import { ISO639_CODES } from '../../types.js';
import { TokenConfigurationLocalizationWASM } from './TokenConfigurationLocalization.js';
export declare class TokenConfigurationConventionWASM {
    /** @private **/
    _rawTokenConfigurationConvention: TokenConfigurationConventionNAPI;
    constructor(localization: {
        [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM;
    }, decimals: number);
    get decimals(): number;
    set decimals(value: number);
    get localizations(): {
        [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM;
    };
    set localizations(localization: {
        [key in ISO639_CODES]?: TokenConfigurationLocalizationWASM;
    });
    static createFromRawInstance(rawInstance: TokenConfigurationConventionNAPI): TokenConfigurationConventionWASM;
}
