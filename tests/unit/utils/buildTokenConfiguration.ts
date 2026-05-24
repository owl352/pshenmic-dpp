import {
  AuthorizedActionTakersWASM,
  ChangeControlRulesWASM,
  TokenConfigurationConventionWASM,
  TokenConfigurationWASM,
  TokenDistributionRulesWASM,
  TokenKeepsHistoryRulesWASM,
  TokenMarketplaceRulesWASM,
  TokenTradeModeWASM
} from 'pshenmic-dpp'

export function buildChangeControlRules (): ChangeControlRulesWASM {
  return new ChangeControlRulesWASM(
    AuthorizedActionTakersWASM.NoOne(),
    AuthorizedActionTakersWASM.NoOne(),
    false,
    false,
    false
  )
}

export function buildTokenConfiguration (
  overrides: { baseSupply?: bigint, maxSupply?: bigint, description?: string } = {}
): TokenConfigurationWASM {
  const conventions = new TokenConfigurationConventionWASM({}, 8)

  const keepsHistory = new TokenKeepsHistoryRulesWASM(false, false, false, false, false, false)

  const distributionRules = new TokenDistributionRulesWASM(
    buildChangeControlRules(),
    buildChangeControlRules(),
    false,
    buildChangeControlRules(),
    buildChangeControlRules(),
    undefined,
    undefined,
    undefined
  )

  const marketplaceRules = new TokenMarketplaceRulesWASM(
    TokenTradeModeWASM.NotTradeable(),
    buildChangeControlRules()
  )

  return new TokenConfigurationWASM(
    conventions,
    buildChangeControlRules(),
    overrides.baseSupply ?? BigInt(100000),
    keepsHistory,
    false,
    false,
    buildChangeControlRules(),
    distributionRules,
    marketplaceRules,
    buildChangeControlRules(),
    buildChangeControlRules(),
    buildChangeControlRules(),
    buildChangeControlRules(),
    buildChangeControlRules(),
    buildChangeControlRules(),
    AuthorizedActionTakersWASM.NoOne(),
    overrides.maxSupply,
    undefined,
    overrides.description
  )
}