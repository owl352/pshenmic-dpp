import { TokenConfigurationConventionWASM } from './TokenConfigurationConvention.js';
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js';
import { TokenPerpetualDistributionWASM } from './TokenPerpetualDistribution.js';
import { IdentifierWASM } from '../Identifier.js';
import { TokenTradeModeWASM } from './TokenTradeMode.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
export class TokenConfigurationChangeItemWASM {
    /** @private **/
    _rawTokenConfigurationChangeItem;
    constructor(rawInstance) {
        this._rawTokenConfigurationChangeItem = rawInstance;
    }
    getItemName() {
        return this._rawTokenConfigurationChangeItem.getItemName();
    }
    getItem() {
        const item = this._rawTokenConfigurationChangeItem.getItem();
        if (item instanceof dppProvider.dpp.TokenConfigurationConventionNAPI) {
            return TokenConfigurationConventionWASM.createFromRawInstance(item);
        }
        else if (item instanceof dppProvider.dpp.AuthorizedActionTakersNAPI) {
            return AuthorizedActionTakersWASM.createFromRawInstance(item);
        }
        else if (item instanceof dppProvider.dpp.TokenPerpetualDistributionNAPI) {
            return TokenPerpetualDistributionWASM.createFromRawInstance(item);
        }
        else if (item instanceof dppProvider.dpp.TokenTradeModeNAPI) {
            return TokenTradeModeWASM.createFromRawInstance(item);
        }
        else if (item instanceof dppProvider.dpp.IdentifierNAPI) {
            return IdentifierWASM.createFromRawInstance(item);
        }
        else if (typeof item === 'string' && this._rawTokenConfigurationChangeItem.getItemName() === 'MaxSupply') {
            return BigInt(item);
        }
        else {
            return item;
        }
    }
    static ConventionsItem(convention) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsItem(convention._rawTokenConfigurationConvention));
    }
    static ConventionsAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static ConventionsControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static FreezeItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.FreezeItem(actionTaker._rawAuthorizedActionTakers));
    }
    static FreezeAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.FreezeAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static DestroyFrozenFundsItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.DestroyFrozenFundsItem(actionTaker._rawAuthorizedActionTakers));
    }
    static DestroyFrozenFundsAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.DestroyFrozenFundsAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static EmergencyActionItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.EmergencyActionItem(actionTaker._rawAuthorizedActionTakers));
    }
    static EmergencyActionAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.EmergencyActionAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MainControlGroupItem(groupContractPosition) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MainControlGroupItem(groupContractPosition));
    }
    static ManualBurningItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualBurningItem(actionTaker._rawAuthorizedActionTakers));
    }
    static ManualBurningAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualBurningAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static ManualMintingItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualMintingItem(actionTaker._rawAuthorizedActionTakers));
    }
    static ManualMintingAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualMintingAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MarketplaceTradeModeItem(tradeMode) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeItem(tradeMode._rawTokenTradeMode));
    }
    static MarketplaceTradeModeControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MarketplaceTradeModeAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MaxSupplyItem(supply) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyItem(supply?.toString()));
    }
    static MaxSupplyControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MaxSupplyAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MintingAllowChoosingDestinationItem(flag) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationItem(flag));
    }
    static MintingAllowChoosingDestinationControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static MintingAllowChoosingDestinationAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static NewTokensDestinationIdentityItem(identityId) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityItem(identityId != null ? prepareIdentifierValue(identityId) : undefined));
    }
    static NewTokensDestinationIdentityControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static NewTokensDestinationIdentityAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static noChangeItem() {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.noChangeItem());
    }
    static PerpetualDistributionConfigurationItem(distribution) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionConfigurationItem(distribution?._rawTokenPerpetualDistribution));
    }
    static PerpetualDistributionControlGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionControlGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static PerpetualDistributionAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static UnfreezeItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.UnfreezeItem(actionTaker._rawAuthorizedActionTakers));
    }
    static UnfreezeAdminGroupItem(actionTaker) {
        return new TokenConfigurationChangeItemWASM(dppProvider.dpp.TokenConfigurationChangeItemNAPI.UnfreezeAdminGroupItem(actionTaker._rawAuthorizedActionTakers));
    }
    static createFromRawInstance(rawInstance) {
        return new TokenConfigurationChangeItemWASM(rawInstance);
    }
}
