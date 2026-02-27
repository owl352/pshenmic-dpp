import { RewardDistributionTypeWASM } from './RewardDistributionType.js';
import { TokenDistributionRecipientWASM } from './TokenDistributionRecipient.js';
import { dppProvider } from '../../provider.js';
export class TokenPerpetualDistributionWASM {
    /** @private **/
    _rawTokenPerpetualDistribution;
    constructor(rewardDistributionType, recipient) {
        this._rawTokenPerpetualDistribution = new dppProvider.dpp.TokenPerpetualDistributionNAPI(rewardDistributionType._rawRewardDistributionType, recipient._rawTokenDistributionRecipient);
    }
    get distributionType() {
        return RewardDistributionTypeWASM.createFromRawInstance(this._rawTokenPerpetualDistribution.distributionType);
    }
    set distributionType(value) {
        this._rawTokenPerpetualDistribution.distributionType = value._rawRewardDistributionType;
    }
    get distributionRecipient() {
        return TokenDistributionRecipientWASM.createFromRawInstance(this._rawTokenPerpetualDistribution.distributionRecipient);
    }
    set distributionRecipient(value) {
        this._rawTokenPerpetualDistribution.distributionRecipient = value._rawTokenDistributionRecipient;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenPerpetualDistributionWASM.prototype);
        instance._rawTokenPerpetualDistribution = rawInstance;
        return instance;
    }
}
