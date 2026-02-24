import type { TokenPerpetualDistributionNAPI } from '../../../../binaries/bindingsTypes.js'
import { RewardDistributionTypeWASM } from './RewardDistributionType.js'
import { TokenDistributionRecipientWASM } from './TokenDistributionRecipient.js'
import { dppProvider } from '../../provider.js'

export class TokenPerpetualDistributionWASM {
  /** @private **/
  _rawTokenPerpetualDistribution: TokenPerpetualDistributionNAPI

  constructor (rewardDistributionType: RewardDistributionTypeWASM, recipient: TokenDistributionRecipientWASM) {
    this._rawTokenPerpetualDistribution = new dppProvider.dpp.TokenPerpetualDistributionNAPI(
      rewardDistributionType._rawRewardDistributionType,
      recipient._rawTokenDistributionRecipient
    )
  }

  get distributionType (): RewardDistributionTypeWASM {
    return RewardDistributionTypeWASM.createFromRawInstance(this._rawTokenPerpetualDistribution.distributionType)
  }

  set distributionType (value: RewardDistributionTypeWASM) {
    this._rawTokenPerpetualDistribution.distributionType = value._rawRewardDistributionType
  }

  get distributionRecipient (): TokenDistributionRecipientWASM {
    return TokenDistributionRecipientWASM.createFromRawInstance(this._rawTokenPerpetualDistribution.distributionRecipient)
  }

  set distributionRecipient (value: TokenDistributionRecipientWASM) {
    this._rawTokenPerpetualDistribution.distributionRecipient = value._rawTokenDistributionRecipient
  }

  static createFromRawInstance (rawInstance: TokenPerpetualDistributionNAPI): TokenPerpetualDistributionWASM {
    const instance: TokenPerpetualDistributionWASM = Object.create(TokenPerpetualDistributionWASM.prototype)
    instance._rawTokenPerpetualDistribution = rawInstance

    return instance
  }
}
