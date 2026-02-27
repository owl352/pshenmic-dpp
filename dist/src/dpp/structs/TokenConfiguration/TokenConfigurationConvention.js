import { TokenConfigurationLocalizationWASM } from './TokenConfigurationLocalization.js';
import { dppProvider } from '../../provider.js';
export class TokenConfigurationConventionWASM {
    /** @private **/
    _rawTokenConfigurationConvention;
    constructor(localization, decimals) {
        const keys = Object.keys(localization);
        const normalLocalization = [];
        for (const key of keys) {
            if (localization[key] == null) {
                throw new Error(`Localization cannot be undefined (${key})`);
            }
            normalLocalization.push([key, localization[key]._rawTokenConfigurationLocalization]);
        }
        this._rawTokenConfigurationConvention = new dppProvider.dpp.TokenConfigurationConventionNAPI(normalLocalization, decimals);
    }
    get decimals() {
        return this._rawTokenConfigurationConvention.decimals;
    }
    set decimals(value) {
        this._rawTokenConfigurationConvention.decimals = value;
    }
    get localizations() {
        const out = {};
        const localizations = this._rawTokenConfigurationConvention.localizations;
        for (const [langCode, localization] of localizations) {
            out[langCode] = TokenConfigurationLocalizationWASM.createFromRawInstance(localization);
        }
        return out;
    }
    set localizations(localization) {
        const keys = Object.keys(localization);
        const normalLocalization = [];
        for (const key of keys) {
            if (localization[key] == null) {
                throw new Error(`Localization cannot be undefined (${key})`);
            }
            normalLocalization.push([key, localization[key]._rawTokenConfigurationLocalization]);
        }
        this._rawTokenConfigurationConvention.localizations = normalLocalization;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenConfigurationConventionWASM.prototype);
        instance._rawTokenConfigurationConvention = rawInstance;
        return instance;
    }
}
