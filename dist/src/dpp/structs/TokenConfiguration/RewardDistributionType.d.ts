import type { RewardDistributionTypeNAPI } from '../../../../binaries/bindingsTypes.js';
import { DistributionFunctionWASM } from './DistributionFunction.js';
import { RewardDistribution } from '../../types.js';
export declare class RewardDistributionTypeWASM {
    /** @private **/
    _rawRewardDistributionType: RewardDistributionTypeNAPI;
    private constructor();
    getDistribution(): RewardDistribution;
    static BlockBasedDistribution(interval: bigint, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM;
    static TimeBasedDistribution(interval: bigint, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM;
    static EpochBasedDistribution(interval: number, distributionFunction: DistributionFunctionWASM): RewardDistributionTypeWASM;
    static createFromRawInstance(rawInstance: RewardDistributionTypeNAPI): RewardDistributionTypeWASM;
}
