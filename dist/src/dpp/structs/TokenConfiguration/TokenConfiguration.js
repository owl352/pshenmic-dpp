import { TokenConfigurationConventionWASM } from './TokenConfigurationConvention.js';
import { ChangeControlRulesWASM } from './ChangeControlRules.js';
import { TokenKeepsHistoryRulesWASM } from './TokenKeepsHistoryRules.js';
import { TokenDistributionRulesWASM } from './TokenDistributionRules.js';
import { TokenMarketplaceRulesWASM } from './TokenMarketplaceRules.js';
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js';
import { dppProvider } from '../../provider.js';
import { IdentifierWASM } from '../Identifier.js';
import { prepareIdentifierValue } from '../../utils.js';
export class TokenConfigurationWASM {
    /** @private **/
    _rawTokenConfiguration;
    constructor(conventions, conventionsChangeRules, baseSupply, keepsHistory, startAsPaused, allowTransferToFrozenBalance, maxSupplyChangeRules, distributionRules, marketplaceRules, manualMintingRules, manualBurningRules, freezeRules, unfreezeRules, destroyFrozenFundsRules, emergencyActionRules, mainControlGroupCanBeModified, maxSupply, mainControlGroup, description) {
        this._rawTokenConfiguration = new dppProvider.dpp.TokenConfigurationNAPI(conventions._rawTokenConfigurationConvention, conventionsChangeRules._rawChangeControlRules, baseSupply.toString(), maxSupply?.toString(), keepsHistory._rawTokenKeepsHistoryRules, startAsPaused, allowTransferToFrozenBalance, maxSupplyChangeRules._rawChangeControlRules, distributionRules._rawTokenDistributionRules, marketplaceRules._rawTokenMarketplaceRules, manualMintingRules._rawChangeControlRules, manualBurningRules._rawChangeControlRules, freezeRules._rawChangeControlRules, unfreezeRules._rawChangeControlRules, destroyFrozenFundsRules._rawChangeControlRules, emergencyActionRules._rawChangeControlRules, mainControlGroup, mainControlGroupCanBeModified?._rawAuthorizedActionTakers, description);
    }
    get conventions() {
        return TokenConfigurationConventionWASM.createFromRawInstance(this._rawTokenConfiguration.conventions);
    }
    set conventions(value) {
        this._rawTokenConfiguration.conventions = value._rawTokenConfigurationConvention;
    }
    get conventionsChangeRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.conventionsChangeRules);
    }
    set conventionsChangeRules(value) {
        this._rawTokenConfiguration.conventionsChangeRules = value._rawChangeControlRules;
    }
    get baseSupply() {
        return BigInt(this._rawTokenConfiguration.baseSupply);
    }
    set baseSupply(value) {
        this._rawTokenConfiguration.baseSupply = value.toString();
    }
    get keepsHistory() {
        return TokenKeepsHistoryRulesWASM.createFromRawInstance(this._rawTokenConfiguration.keepsHistory);
    }
    set keepsHistory(value) {
        this._rawTokenConfiguration.keepsHistory = value._rawTokenKeepsHistoryRules;
    }
    get startAsPaused() {
        return this._rawTokenConfiguration.startAsPaused;
    }
    set startAsPaused(value) {
        this._rawTokenConfiguration.startAsPaused = value;
    }
    get isAllowedTransferToFrozenBalance() {
        return this._rawTokenConfiguration.isAllowedTransferToFrozenBalance;
    }
    set isAllowedTransferToFrozenBalance(value) {
        this._rawTokenConfiguration.isAllowedTransferToFrozenBalance = value;
    }
    get maxSupply() {
        const supply = this._rawTokenConfiguration.maxSupply;
        return supply != null ? BigInt(supply) : undefined;
    }
    set maxSupply(value) {
        this._rawTokenConfiguration.maxSupply = value?.toString();
    }
    get maxSupplyChangeRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.maxSupplyChangeRules);
    }
    set maxSupplyChangeRules(value) {
        this._rawTokenConfiguration.maxSupplyChangeRules = value._rawChangeControlRules;
    }
    get distributionRules() {
        return TokenDistributionRulesWASM.createFromRawInstance(this._rawTokenConfiguration.distributionRules);
    }
    set distributionRules(value) {
        this._rawTokenConfiguration.distributionRules = value._rawTokenDistributionRules;
    }
    get marketplaceRules() {
        return TokenMarketplaceRulesWASM.createFromRawInstance(this._rawTokenConfiguration.marketplaceRules);
    }
    set marketplaceRules(value) {
        this._rawTokenConfiguration.marketplaceRules = value._rawTokenMarketplaceRules;
    }
    get manualMintingRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.manualMintingRules);
    }
    set manualMintingRules(value) {
        this._rawTokenConfiguration.manualMintingRules = value._rawChangeControlRules;
    }
    get manualBurningRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.manualBurningRules);
    }
    set manualBurningRules(value) {
        this._rawTokenConfiguration.manualBurningRules = value._rawChangeControlRules;
    }
    get freezeRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.freezeRules);
    }
    set freezeRules(value) {
        this._rawTokenConfiguration.freezeRules = value._rawChangeControlRules;
    }
    get unfreezeRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.unfreezeRules);
    }
    set unfreezeRules(value) {
        this._rawTokenConfiguration.unfreezeRules = value._rawChangeControlRules;
    }
    get destroyFrozenFundsRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.destroyFrozenFundsRules);
    }
    set destroyFrozenFundsRules(value) {
        this._rawTokenConfiguration.destroyFrozenFundsRules = value._rawChangeControlRules;
    }
    get emergencyActionRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.emergencyActionRules);
    }
    set emergencyActionRules(value) {
        this._rawTokenConfiguration.emergencyActionRules = value._rawChangeControlRules;
    }
    get mainControlGroup() {
        return this._rawTokenConfiguration.mainControlGroup ?? undefined;
    }
    set mainControlGroup(value) {
        this._rawTokenConfiguration.mainControlGroup = value;
    }
    get mainControlGroupCanBeModified() {
        return AuthorizedActionTakersWASM.createFromRawInstance(this._rawTokenConfiguration.mainControlGroupCanBeModified);
    }
    set mainControlGroupCanBeModified(value) {
        this._rawTokenConfiguration.mainControlGroupCanBeModified = value._rawAuthorizedActionTakers;
    }
    get description() {
        return this._rawTokenConfiguration.description ?? undefined;
    }
    set description(value) {
        this._rawTokenConfiguration.description = value;
    }
    static calculateTokenId(contractId, tokenPosition) {
        return IdentifierWASM.createFromRawInstance(dppProvider.dpp.TokenConfigurationNAPI.calculateTokenId(prepareIdentifierValue(contractId), tokenPosition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenConfigurationWASM.prototype);
        instance._rawTokenConfiguration = rawInstance;
        return instance;
    }
}
