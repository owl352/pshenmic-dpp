import { dppProvider } from '../../provider.js';
export class TokenConfigurationLocalizationWASM {
    /** @private **/
    _rawTokenConfigurationLocalization;
    constructor(shouldCapitalize, singularForm, pluralForm) {
        this._rawTokenConfigurationLocalization = new dppProvider.dpp.TokenConfigurationLocalizationNAPI(shouldCapitalize, singularForm, pluralForm);
    }
    get shouldCapitalize() {
        return this._rawTokenConfigurationLocalization.shouldCapitalize;
    }
    set shouldCapitalize(shouldCapitalize) {
        this._rawTokenConfigurationLocalization.shouldCapitalize = shouldCapitalize;
    }
    get pluralForm() {
        return this._rawTokenConfigurationLocalization.pluralForm;
    }
    set pluralForm(pluralForm) {
        this._rawTokenConfigurationLocalization.pluralForm = pluralForm;
    }
    get singularForm() {
        return this._rawTokenConfigurationLocalization.singularForm;
    }
    set singularForm(singularForm) {
        this._rawTokenConfigurationLocalization.singularForm = singularForm;
    }
    toJSON() {
        return this._rawTokenConfigurationLocalization.toJSON();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenConfigurationLocalizationWASM.prototype);
        instance._rawTokenConfigurationLocalization = rawInstance;
        return instance;
    }
}
