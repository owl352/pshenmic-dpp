import {
  RewardDistributionTypeNAPI
} from '../../../../binaries/bindingsTypes.js'
import { DistributionFunctionWASM } from './DistributionFunction.js'
import { dppProvider } from '../../provider.js'
import { RewardDistribution } from '../../types.js'

export class RewardDistributionTypeWASM {
  /** @private **/
  _rawRewardDistributionType: RewardDistributionTypeNAPI

  private constructor (rawInstance: RewardDistributionTypeNAPI) {
    this._rawRewardDistributionType = rawInstance
  }

  getDistribution (): RewardDistribution {
    const dist = this._rawRewardDistributionType.getDistribution()

    const interval = typeof dist.interval === 'number' ? dist.interval : BigInt(dist.interval)
    let distributionType: 'BlockBasedDistribution' | 'TimeBasedDistribution' | 'EpochBasedDistribution'

    if (dist instanceof dppProvider.dpp.BlockBasedDistributionNAPI) {
      distributionType = 'BlockBasedDistribution'
    } else if (dist instanceof dppProvider.dpp.TimeBasedDistributionNAPI) {
      distributionType = 'TimeBasedDistribution'
    } else {
      distributionType = 'EpochBasedDistribution'
    }

    return {
      interval,
      function: DistributionFunctionWASM.createFromRawInstance(dist.function),
      distributionType
    }
  }

  static BlockBasedDistribution (interval: bigint, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM {
    return new RewardDistributionTypeWASM(
      dppProvider.dpp.RewardDistributionTypeNAPI.BlockBasedDistribution(interval.toString(), distributionFunction._rawDistributionFunction)
    )
  }

  static TimeBasedDistribution (interval: bigint, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM {
    return new RewardDistributionTypeWASM(
      dppProvider.dpp.RewardDistributionTypeNAPI.TimeBasedDistribution(interval.toString(), distributionFunction._rawDistributionFunction)
    )
  }

  static EpochBasedDistribution (interval: number, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM {
    return new RewardDistributionTypeWASM(
      dppProvider.dpp.RewardDistributionTypeNAPI.EpochBasedDistribution(interval, distributionFunction._rawDistributionFunction)
    )
  }

  static createFromRawInstance (rawInstance: RewardDistributionTypeNAPI): RewardDistributionTypeWASM {
    return new RewardDistributionTypeWASM(rawInstance)
  }
}
