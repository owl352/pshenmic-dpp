import type { TokenPerpetualDistributionNAPI } from '../../../../binaries/bindingsTypes.js';
import { RewardDistributionTypeWASM } from './RewardDistributionType.js';
import { TokenDistributionRecipientWASM } from './TokenDistributionRecipient.js';
export declare class TokenPerpetualDistributionWASM {
    /** @private **/
    _rawTokenPerpetualDistribution: TokenPerpetualDistributionNAPI;
    constructor(rewardDistributionType: RewardDistributionTypeWASM, recipient: TokenDistributionRecipientWASM);
    get distributionType(): RewardDistributionTypeWASM;
    set distributionType(value: RewardDistributionTypeWASM);
    get distributionRecipient(): TokenDistributionRecipientWASM;
    set distributionRecipient(value: TokenDistributionRecipientWASM);
    static createFromRawInstance(rawInstance: TokenPerpetualDistributionNAPI): TokenPerpetualDistributionWASM;
}
