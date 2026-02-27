import type { TokenDistributionRulesNAPI } from '../../../../binaries/bindingsTypes.js';
import { TokenPerpetualDistributionWASM } from './TokenPerpetualDistribution.js';
import { ChangeControlRulesWASM } from './ChangeControlRules.js';
import { TokenPreProgrammedDistributionWASM } from './TokenPreProgrammedDistribution.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class TokenDistributionRulesWASM {
    /** @private **/
    _rawTokenDistributionRules: TokenDistributionRulesNAPI;
    constructor(perpetualDistributionRules: ChangeControlRulesWASM, newTokensDestinationIdentityRules: ChangeControlRulesWASM, mintingAllowChoosingDestination: boolean, mintingAllowChoosingDestinationRules: ChangeControlRulesWASM, changeDirectPurchasePricingRules: ChangeControlRulesWASM, perpetualDistribution?: TokenPerpetualDistributionWASM, preProgrammedDistribution?: TokenPreProgrammedDistributionWASM, newTokensDestinationIdentity?: IdentifierLike);
    get perpetualDistribution(): TokenPerpetualDistributionWASM | undefined;
    set perpetualDistribution(perpetualDistribution: TokenPerpetualDistributionWASM);
    get perpetualDistributionRules(): ChangeControlRulesWASM;
    set perpetualDistributionRules(rules: ChangeControlRulesWASM);
    get preProgrammedDistribution(): TokenPreProgrammedDistributionWASM | undefined;
    set preProgrammedDistribution(preProgrammedDistribution: TokenPreProgrammedDistributionWASM);
    get newTokenDestinationIdentity(): IdentifierWASM | undefined;
    set newTokenDestinationIdentity(destinationIdentity: IdentifierLike | undefined);
    get newTokenDestinationIdentityRules(): ChangeControlRulesWASM;
    set newTokenDestinationIdentityRules(rules: ChangeControlRulesWASM);
    get mintingAllowChoosingDestination(): boolean;
    set mintingAllowChoosingDestination(mintingAllowChoosingDestination: boolean);
    get mintingAllowChoosingDestinationRules(): ChangeControlRulesWASM;
    set mintingAllowChoosingDestinationRules(mintingAllowChoosingDestinationRules: ChangeControlRulesWASM);
    get changeDirectPurchasePricingRules(): ChangeControlRulesWASM;
    set changeDirectPurchasePricingRules(changeDirectPurchasePricingRules: ChangeControlRulesWASM);
    static createFromRawInstance(rawInstance: TokenDistributionRulesNAPI): TokenDistributionRulesWASM;
}
