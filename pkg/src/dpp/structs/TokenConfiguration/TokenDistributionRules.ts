import { TokenDistributionRulesNAPI } from '../../../../binaries/bindingsTypes.js'
import { TokenPerpetualDistributionWASM } from './TokenPerpetualDistribution.js'
import { ChangeControlRulesWASM } from './ChangeControlRules.js'
import { TokenPreProgrammedDistributionWASM } from './TokenPreProgrammedDistribution.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class TokenDistributionRulesWASM {
  /** @private **/
  _rawTokenDistributionRules: TokenDistributionRulesNAPI

  constructor (
    perpetualDistributionRules: ChangeControlRulesWASM,
    newTokensDestinationIdentityRules: ChangeControlRulesWASM,
    mintingAllowChoosingDestination: boolean,
    mintingAllowChoosingDestinationRules: ChangeControlRulesWASM,
    changeDirectPurchasePricingRules: ChangeControlRulesWASM,
    perpetualDistribution?: TokenPerpetualDistributionWASM,
    preProgrammedDistribution?: TokenPreProgrammedDistributionWASM,
    newTokensDestinationIdentity?: IdentifierLike
  ) {
    this._rawTokenDistributionRules = new dppProvider.dpp.TokenDistributionRulesNAPI(
      perpetualDistribution?._rawTokenPerpetualDistribution,
      perpetualDistributionRules._rawChangeControlRules,
      preProgrammedDistribution?._rawTokenPreProgrammedDistribution,
      newTokensDestinationIdentity != null ? prepareIdentifierValue(newTokensDestinationIdentity) : undefined,
      newTokensDestinationIdentityRules._rawChangeControlRules,
      mintingAllowChoosingDestination,
      mintingAllowChoosingDestinationRules?._rawChangeControlRules,
      changeDirectPurchasePricingRules?._rawChangeControlRules
    )
  }

  get perpetualDistribution (): TokenPerpetualDistributionWASM | undefined {
    const dist = this._rawTokenDistributionRules.perpetualDistribution

    if (dist != null) {
      return TokenPerpetualDistributionWASM.createFromRawInstance(dist)
    }
  }

  set perpetualDistribution (perpetualDistribution: TokenPerpetualDistributionWASM) {
    this._rawTokenDistributionRules.perpetualDistribution = perpetualDistribution._rawTokenPerpetualDistribution
  }

  get perpetualDistributionRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.perpetualDistributionRules)
  }

  set perpetualDistributionRules (rules: ChangeControlRulesWASM) {
    this._rawTokenDistributionRules.perpetualDistributionRules = rules._rawChangeControlRules
  }

  get preProgrammedDistribution (): TokenPreProgrammedDistributionWASM | undefined {
    const dist = this._rawTokenDistributionRules.preProgrammedDistribution

    if (dist != null) {
      return TokenPreProgrammedDistributionWASM.createFromRawInstance(dist)
    }
  }

  set preProgrammedDistribution (preProgrammedDistribution: TokenPreProgrammedDistributionWASM) {
    this._rawTokenDistributionRules.preProgrammedDistribution = preProgrammedDistribution._rawTokenPreProgrammedDistribution
  }

  get newTokenDestinationIdentity (): IdentifierWASM | undefined {
    const destination = this._rawTokenDistributionRules.newTokenDestinationIdentity

    if (destination != null) {
      return IdentifierWASM.createFromRawInstance(destination)
    }
  }

  set newTokenDestinationIdentity (destinationIdentity: IdentifierLike | undefined) {
    this._rawTokenDistributionRules.newTokenDestinationIdentity = destinationIdentity != null ? prepareIdentifierValue(destinationIdentity) : undefined
  }

  get newTokenDestinationIdentityRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.newTokenDestinationIdentityRules)
  }

  set newTokenDestinationIdentityRules (rules: ChangeControlRulesWASM) {
    this._rawTokenDistributionRules.newTokenDestinationIdentityRules = rules._rawChangeControlRules
  }

  get mintingAllowChoosingDestination (): boolean {
    return this._rawTokenDistributionRules.mintingAllowChoosingDestination
  }

  set mintingAllowChoosingDestination (mintingAllowChoosingDestination: boolean) {
    this._rawTokenDistributionRules.mintingAllowChoosingDestination = mintingAllowChoosingDestination
  }

  get mintingAllowChoosingDestinationRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.mintingAllowChoosingDestinationRules)
  }

  set mintingAllowChoosingDestinationRules (mintingAllowChoosingDestinationRules: ChangeControlRulesWASM) {
    this._rawTokenDistributionRules.mintingAllowChoosingDestinationRules = mintingAllowChoosingDestinationRules._rawChangeControlRules
  }

  get changeDirectPurchasePricingRules (): ChangeControlRulesWASM {
    return ChangeControlRulesWASM.createFromRawInstance(this._rawTokenDistributionRules.changeDirectPurchasePricingRules)
  }

  set changeDirectPurchasePricingRules (changeDirectPurchasePricingRules: ChangeControlRulesWASM) {
    this._rawTokenDistributionRules.changeDirectPurchasePricingRules = changeDirectPurchasePricingRules._rawChangeControlRules
  }

  static createFromRawInstance (rawInstance: TokenDistributionRulesNAPI): TokenDistributionRulesWASM {
    const instance: TokenDistributionRulesWASM = Object.create(this.prototype)
    instance._rawTokenDistributionRules = rawInstance

    return instance
  }
}
