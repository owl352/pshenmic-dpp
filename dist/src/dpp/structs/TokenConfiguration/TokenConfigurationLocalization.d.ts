import type { TokenConfigurationLocalizationNAPI } from '../../../../binaries/bindingsTypes.js';
import { TokenConfigurationLocalizationJson } from '../../types.js';
export declare class TokenConfigurationLocalizationWASM {
    /** @private **/
    _rawTokenConfigurationLocalization: TokenConfigurationLocalizationNAPI;
    constructor(shouldCapitalize: boolean, singularForm: string, pluralForm: string);
    get shouldCapitalize(): boolean;
    set shouldCapitalize(shouldCapitalize: boolean);
    get pluralForm(): string;
    set pluralForm(pluralForm: string);
    get singularForm(): string;
    set singularForm(singularForm: string);
    toJSON(): TokenConfigurationLocalizationJson;
    static createFromRawInstance(rawInstance: TokenConfigurationLocalizationNAPI): TokenConfigurationLocalizationWASM;
}
