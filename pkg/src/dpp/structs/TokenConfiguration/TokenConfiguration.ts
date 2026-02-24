import type { TokenConfigurationNAPI } from '../../../../binaries/bindingsTypes.js'
import { TokenConfigurationConventionWASM } from './TokenConfigurationConvention.js'
import { ChangeControlRulesWASM } from './ChangeControlRules.js'
import { TokenKeepsHistoryRulesWASM } from './TokenKeepsHistoryRules.js'
import { TokenDistributionRulesWASM } from './TokenDistributionRules.js'
import { TokenMarketplaceRulesWASM } from './TokenMarketplaceRules.js'
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike } from '../../types.js'
import { IdentifierWASM } from '../Identifier.js'
import { prepareIdentifierValue } from '../../utils.js'

export class TokenConfigurationWASM {
  /** @private **/
  _rawTokenConfiguration: TokenConfigurationNAPI

  constructor (
    conventions: TokenConfigurationConventionWASM,
    conventionsChangeRules: ChangeControlRulesWASM,
    baseSupply: bigint,
    keepsHistory: TokenKeepsHistoryRulesWASM,
    startAsPaused: boolean,
    allowTransferToFrozenBalance: boolean,
    maxSupplyChangeRules: ChangeControlRulesWASM,
    distributionRules: TokenDistributionRulesWASM,
    marketplaceRules: TokenMarketplaceRulesWASM,
    manualMintingRules: ChangeControlRulesWASM,
    manualBurningRules: ChangeControlRulesWASM,
    freezeRules: ChangeControlRulesWASM,
    unfreezeRules: ChangeControlRulesWASM,
    destroyFrozenFundsRules: ChangeControlRulesWASM,
    emergencyActionRules: ChangeControlRulesWASM,
    mainControlGroupCanBeModified: AuthorizedActionTakersWASM,
    maxSupply?: bigint,
    mainControlGroup?: number,
    description?: string
  ) {
    this._rawTokenConfiguration = new dppProvider.dpp.TokenConfigurationNAPI(
      conventions._rawTokenConfigurationConvention,
      conventionsChangeRules._rawChangeControlRules,
      baseSupply.toString(),
      maxSupply?.toString(),
      keepsHistory._rawTokenKeepsHistoryRules,
      startAsPaused,
      allowTransferToFrozenBalance,
      maxSupplyChangeRules._rawChangeControlRules,
      distributionRules._rawTokenDistributionRules,
      marketplaceRules._rawTokenMarketplaceRules,
      manualMintingRules._rawChangeControlRules,
      manualBurningRules._rawChangeControlRules,
      freezeRules._rawChangeControlRules,
      unfreezeRules._rawChangeControlRules,
      destroyFrozenFundsRules._rawChangeControlRules,
      emergencyActionRules._rawChangeControlRules,
      mainControlGroup,
      mainControlGroupCanBeModified?._rawAuthorizedActionTakers,
      description
    )
  }

  get conventions (): TokenConfigurationConventionWASM {
    return TokenConfigurationConventionWASM.createFromRawInstance(this._rawTokenConfiguration.conventions)
  }

  set conventions (value: TokenConfigurationConventionWASM) {
    this._rawTokenConfiguration.conventions = value._rawTokenConfigurationConvention
  }

  get conventionsChangeRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.conventionsChangeRules)
  }

  set conventionsChangeRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.conventionsChangeRules = value._rawChangeControlRules
  }

  get baseSupply (): bigint {
    return BigInt(this._rawTokenConfiguration.baseSupply)
  }

  set baseSupply (value: bigint) {
    this._rawTokenConfiguration.baseSupply = value.toString()
  }

  get keepsHistory (): TokenKeepsHistoryRulesWASM {
    return TokenKeepsHistoryRulesWASM.createFromRawInstance(this._rawTokenConfiguration.keepsHistory)
  }

  set keepsHistory (value: TokenKeepsHistoryRulesWASM) {
    this._rawTokenConfiguration.keepsHistory = value._rawTokenKeepsHistoryRules
  }

  get startAsPaused (): boolean {
    return this._rawTokenConfiguration.startAsPaused
  }

  set startAsPaused (value: boolean) {
    this._rawTokenConfiguration.startAsPaused = value
  }

  get isAllowedTransferToFrozenBalance (): boolean {
    return this._rawTokenConfiguration.isAllowedTransferToFrozenBalance
  }

  set isAllowedTransferToFrozenBalance (value: boolean) {
    this._rawTokenConfiguration.isAllowedTransferToFrozenBalance = value
  }

  get maxSupply (): bigint | undefined {
    const supply = this._rawTokenConfiguration.maxSupply

    return supply != null ? BigInt(supply) : undefined
  }

  set maxSupply (value: bigint | undefined) {
    this._rawTokenConfiguration.maxSupply = value?.toString()
  }

  get maxSupplyChangeRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.maxSupplyChangeRules)
  }

  set maxSupplyChangeRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.maxSupplyChangeRules = value._rawChangeControlRules
  }

  get distributionRules (): TokenDistributionRulesWASM {
    return TokenDistributionRulesWASM.createFromRawInstance(this._rawTokenConfiguration.distributionRules)
  }

  set distributionRules (value: TokenDistributionRulesWASM) {
    this._rawTokenConfiguration.distributionRules = value._rawTokenDistributionRules
  }

  get marketplaceRules (): TokenMarketplaceRulesWASM {
    return TokenMarketplaceRulesWASM.createFromRawInstance(this._rawTokenConfiguration.marketplaceRules)
  }

  set marketplaceRules (value: TokenMarketplaceRulesWASM) {
    this._rawTokenConfiguration.marketplaceRules = value._rawTokenMarketplaceRules
  }

  get manualMintingRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.manualMintingRules)
  }

  set manualMintingRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.manualMintingRules = value._rawChangeControlRules
  }

  get manualBurningRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.manualBurningRules)
  }

  set manualBurningRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.manualBurningRules = value._rawChangeControlRules
  }

  get freezeRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.freezeRules)
  }

  set freezeRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.freezeRules = value._rawChangeControlRules
  }

  get unfreezeRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.unfreezeRules)
  }

  set unfreezeRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.unfreezeRules = value._rawChangeControlRules
  }

  get destroyFrozenFundsRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.destroyFrozenFundsRules)
  }

  set destroyFrozenFundsRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.destroyFrozenFundsRules = value._rawChangeControlRules
  }

  get emergencyActionRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenConfiguration.emergencyActionRules)
  }

  set emergencyActionRules (value: ChangeControlRulesWASM) {
    this._rawTokenConfiguration.emergencyActionRules = value._rawChangeControlRules
  }

  get mainControlGroup (): number | undefined {
    return this._rawTokenConfiguration.mainControlGroup ?? undefined
  }

  set mainControlGroup (value: number | undefined) {
    this._rawTokenConfiguration.mainControlGroup = value
  }

  get mainControlGroupCanBeModified (): AuthorizedActionTakersWASM {
    return AuthorizedActionTakersWASM.createFromRawInstance(this._rawTokenConfiguration.mainControlGroupCanBeModified)
  }

  set mainControlGroupCanBeModified (value: AuthorizedActionTakersWASM) {
    this._rawTokenConfiguration.mainControlGroupCanBeModified = value._rawAuthorizedActionTakers
  }

  get description (): string | undefined {
    return this._rawTokenConfiguration.description ?? undefined
  }

  set description (value: string | undefined) {
    this._rawTokenConfiguration.description = value
  }

  static calculateTokenId (contractId: IdentifierLike, tokenPosition: number): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(dppProvider.dpp.TokenConfigurationNAPI.calculateTokenId(prepareIdentifierValue(contractId), tokenPosition))
  }

  static createFromRawInstance (rawInstance: TokenConfigurationNAPI): TokenConfigurationWASM {
    const instance: TokenConfigurationWASM = Object.create(TokenConfigurationWASM.prototype)
    instance._rawTokenConfiguration = rawInstance

    return instance
  }
}
