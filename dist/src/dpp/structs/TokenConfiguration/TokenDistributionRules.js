import { TokenPerpetualDistributionWASM } from './TokenPerpetualDistribution.js';
import { ChangeControlRulesWASM } from './ChangeControlRules.js';
import { TokenPreProgrammedDistributionWASM } from './TokenPreProgrammedDistribution.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class TokenDistributionRulesWASM {
    /** @private **/
    _rawTokenDistributionRules;
    constructor(perpetualDistributionRules, newTokensDestinationIdentityRules, mintingAllowChoosingDestination, mintingAllowChoosingDestinationRules, changeDirectPurchasePricingRules, perpetualDistribution, preProgrammedDistribution, newTokensDestinationIdentity) {
        this._rawTokenDistributionRules = new dppProvider.dpp.TokenDistributionRulesNAPI(perpetualDistribution?._rawTokenPerpetualDistribution, perpetualDistributionRules._rawChangeControlRules, preProgrammedDistribution?._rawTokenPreProgrammedDistribution, newTokensDestinationIdentity != null ? prepareIdentifierValue(newTokensDestinationIdentity) : undefined, newTokensDestinationIdentityRules._rawChangeControlRules, mintingAllowChoosingDestination, mintingAllowChoosingDestinationRules?._rawChangeControlRules, changeDirectPurchasePricingRules?._rawChangeControlRules);
    }
    get perpetualDistribution() {
        const dist = this._rawTokenDistributionRules.perpetualDistribution;
        if (dist != null) {
            return TokenPerpetualDistributionWASM.createFromRawInstance(dist);
        }
    }
    set perpetualDistribution(perpetualDistribution) {
        this._rawTokenDistributionRules.perpetualDistribution = perpetualDistribution._rawTokenPerpetualDistribution;
    }
    get perpetualDistributionRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.perpetualDistributionRules);
    }
    set perpetualDistributionRules(rules) {
        this._rawTokenDistributionRules.perpetualDistributionRules = rules._rawChangeControlRules;
    }
    get preProgrammedDistribution() {
        const dist = this._rawTokenDistributionRules.preProgrammedDistribution;
        if (dist != null) {
            return TokenPreProgrammedDistributionWASM.createFromRawInstance(dist);
        }
    }
    set preProgrammedDistribution(preProgrammedDistribution) {
        this._rawTokenDistributionRules.preProgrammedDistribution = preProgrammedDistribution._rawTokenPreProgrammedDistribution;
    }
    get newTokenDestinationIdentity() {
        const destination = this._rawTokenDistributionRules.newTokenDestinationIdentity;
        if (destination != null) {
            return IdentifierWASM.createFromRawInstance(destination);
        }
    }
    set newTokenDestinationIdentity(destinationIdentity) {
        this._rawTokenDistributionRules.newTokenDestinationIdentity = destinationIdentity != null ? prepareIdentifierValue(destinationIdentity) : undefined;
    }
    get newTokenDestinationIdentityRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.newTokenDestinationIdentityRules);
    }
    set newTokenDestinationIdentityRules(rules) {
        this._rawTokenDistributionRules.newTokenDestinationIdentityRules = rules._rawChangeControlRules;
    }
    get mintingAllowChoosingDestination() {
        return this._rawTokenDistributionRules.mintingAllowChoosingDestination;
    }
    set mintingAllowChoosingDestination(mintingAllowChoosingDestination) {
        this._rawTokenDistributionRules.mintingAllowChoosingDestination = mintingAllowChoosingDestination;
    }
    get mintingAllowChoosingDestinationRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.mintingAllowChoosingDestinationRules);
    }
    set mintingAllowChoosingDestinationRules(mintingAllowChoosingDestinationRules) {
        this._rawTokenDistributionRules.mintingAllowChoosingDestinationRules = mintingAllowChoosingDestinationRules._rawChangeControlRules;
    }
    get changeDirectPurchasePricingRules() {
        return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.changeDirectPurchasePricingRules);
    }
    set changeDirectPurchasePricingRules(changeDirectPurchasePricingRules) {
        this._rawTokenDistributionRules.changeDirectPurchasePricingRules = changeDirectPurchasePricingRules._rawChangeControlRules;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenDistributionRulesWASM.prototype);
        instance._rawTokenDistributionRules = rawInstance;
        return instance;
    }
}
