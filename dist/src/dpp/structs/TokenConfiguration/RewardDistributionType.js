import { DistributionFunctionWASM } from './DistributionFunction.js';
import { dppProvider } from '../../provider.js';
export class RewardDistributionTypeWASM {
    /** @private **/
    _rawRewardDistributionType;
    constructor(rawInstance) {
        this._rawRewardDistributionType = rawInstance;
    }
    getDistribution() {
        const dist = this._rawRewardDistributionType.getDistribution();
        const interval = typeof dist.interval === 'number' ? dist.interval : BigInt(dist.interval);
        let distributionType;
        if (dist instanceof dppProvider.dpp.BlockBasedDistributionNAPI) {
            distributionType = 'BlockBasedDistribution';
        }
        else if (dist instanceof dppProvider.dpp.TimeBasedDistributionNAPI) {
            distributionType = 'TimeBasedDistribution';
        }
        else {
            distributionType = 'EpochBasedDistribution';
        }
        return {
            interval,
            function: DistributionFunctionWASM.createFromRawInstance(dist.function),
            distributionType
        };
    }
    static BlockBasedDistribution(interval, distributionFunction) {
        return new RewardDistributionTypeWASM(dppProvider.dpp.RewardDistributionTypeNAPI.BlockBasedDistribution(interval.toString(), distributionFunction._rawDistributionFunction));
    }
    static TimeBasedDistribution(interval, distributionFunction) {
        return new RewardDistributionTypeWASM(dppProvider.dpp.RewardDistributionTypeNAPI.TimeBasedDistribution(interval.toString(), distributionFunction._rawDistributionFunction));
    }
    static EpochBasedDistribution(interval, distributionFunction) {
        return new RewardDistributionTypeWASM(dppProvider.dpp.RewardDistributionTypeNAPI.EpochBasedDistribution(interval, distributionFunction._rawDistributionFunction));
    }
    static createFromRawInstance(rawInstance) {
        return new RewardDistributionTypeWASM(rawInstance);
    }
}
