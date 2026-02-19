import {
  AuthorizedActionTakersNAPI, IdentifierNAPI,
  TokenConfigurationChangeItemNAPI,
  TokenConfigurationConventionNAPI, TokenPerpetualDistributionNAPI, TokenTradeModeNAPI
} from '../../../../binaries/bindingsTypes.js'
import { TokenConfigurationConventionWASM } from './TokenConfigurationConvention.js'
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js'
import { TokenPerpetualDistributionWASM } from './TokenPerpetualDistribution.js'
import { IdentifierWASM } from '../Identifier.js'
import { TokenTradeModeWASM } from './TokenTradeMode.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike } from '../../types.js'
import { prepareIdentifierValue } from '../../utils.js'

export class TokenConfigurationChangeItemWASM {
  /** @private **/
  _rawTokenConfigurationChangeItem: TokenConfigurationChangeItemNAPI

  private constructor (rawInstance: TokenConfigurationChangeItemNAPI) {
    this._rawTokenConfigurationChangeItem = rawInstance
  }

  getItemName (): string {
    return this._rawTokenConfigurationChangeItem.getItemName()
  }

  getItem (): string | TokenConfigurationConventionWASM | AuthorizedActionTakersWASM | bigint | TokenPerpetualDistributionWASM | IdentifierWASM | boolean | TokenTradeModeWASM | number | undefined | null {
    const item = this._rawTokenConfigurationChangeItem.getItem()

    if (item instanceof TokenConfigurationConventionNAPI) {
      return TokenConfigurationConventionWASM.createFromRawInstance(item)
    } else if (item instanceof AuthorizedActionTakersNAPI) {
      return AuthorizedActionTakersWASM.createFromRawInstance(item)
    } else if (item instanceof TokenPerpetualDistributionNAPI) {
      return TokenPerpetualDistributionWASM.createFromRawInstance(item)
    } else if (item instanceof TokenTradeModeNAPI) {
      return TokenTradeModeWASM.createFromRawInstance(item)
    } else if (item instanceof IdentifierNAPI) {
      return IdentifierWASM.createFromRawInstance(item)
    } else if (typeof item === 'string' && this._rawTokenConfigurationChangeItem.getItemName() === 'MaxSupply') {
      return BigInt(item)
    } else {
      return item
    }
  }

  static ConventionsItem (convention: TokenConfigurationConventionWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsItem(convention._rawTokenConfigurationConvention)
    )
  }

  static ConventionsAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static ConventionsControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ConventionsControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static FreezeItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.FreezeItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static FreezeAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.FreezeAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static DestroyFrozenFundsItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.DestroyFrozenFundsItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static DestroyFrozenFundsAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.DestroyFrozenFundsAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static EmergencyActionItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.EmergencyActionItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static EmergencyActionAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.EmergencyActionAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MainControlGroupItem (groupContractPosition?: number): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MainControlGroupItem(groupContractPosition)
    )
  }

  static ManualBurningItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualBurningItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static ManualBurningAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualBurningAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static ManualMintingItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualMintingItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static ManualMintingAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.ManualMintingAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MarketplaceTradeModeItem (tradeMode: TokenTradeModeWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeItem(tradeMode._rawTokenTradeMode)
    )
  }

  static MarketplaceTradeModeControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MarketplaceTradeModeAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MarketplaceTradeModeAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MaxSupplyItem (supply?: bigint): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyItem(supply?.toString())
    )
  }

  static MaxSupplyControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MaxSupplyAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MaxSupplyAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MintingAllowChoosingDestinationItem (flag: boolean): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationItem(flag)
    )
  }

  static MintingAllowChoosingDestinationControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static MintingAllowChoosingDestinationAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.MintingAllowChoosingDestinationAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static NewTokensDestinationIdentityItem (identityId?: IdentifierLike): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityItem(identityId != null ? prepareIdentifierValue(identityId) : undefined)
    )
  }

  static NewTokensDestinationIdentityControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static NewTokensDestinationIdentityAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.NewTokensDestinationIdentityAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static noChangeItem (): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.noChangeItem()
    )
  }

  static PerpetualDistributionConfigurationItem (distribution?: TokenPerpetualDistributionWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionConfigurationItem(distribution?._rawTokenPerpetualDistribution)
    )
  }

  static PerpetualDistributionControlGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionControlGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static PerpetualDistributionAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.PerpetualDistributionAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static UnfreezeItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.UnfreezeItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static UnfreezeAdminGroupItem (actionTaker: AuthorizedActionTakersWASM): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(
      dppProvider.dpp.TokenConfigurationChangeItemNAPI.UnfreezeAdminGroupItem(actionTaker._rawAuthorizedActionTakers)
    )
  }

  static createFromRawInstance (rawInstance: TokenConfigurationChangeItemNAPI): TokenConfigurationChangeItemWASM {
    return new TokenConfigurationChangeItemWASM(rawInstance)
  }
}
