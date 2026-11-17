import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
function objectToDistributionArray(distributions) {
    const timestamps = Object.keys(distributions);
    const normalDistribution = [];
    for (const timestamp of timestamps) {
        const ids = Object.keys(distributions[timestamp]);
        const identifiersWithAmount = [];
        for (const identifier of ids) {
            identifiersWithAmount.push([prepareIdentifierValue(identifier), distributions[timestamp][identifier].toString()]);
        }
        normalDistribution.push([timestamp, identifiersWithAmount]);
    }
    return normalDistribution;
}
export class TokenPreProgrammedDistributionWASM {
    /** @private **/
    _rawTokenPreProgrammedDistribution;
    constructor(distributions) {
        this._rawTokenPreProgrammedDistribution = new dppProvider.dpp.TokenPreProgrammedDistributionNAPI(objectToDistributionArray(distributions));
    }
    get distributions() {
        const distributions = this._rawTokenPreProgrammedDistribution.distributions;
        const out = {};
        for (const [timestamp, identifiers] of distributions) {
            const ids = {};
            for (const [id, amount] of identifiers) {
                ids[id.base58()] = BigInt(amount);
            }
            out[timestamp] = ids;
        }
        return out;
    }
    set distributions(distributions) {
        this._rawTokenPreProgrammedDistribution.distributions = objectToDistributionArray(distributions);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenPreProgrammedDistributionWASM.prototype);
        instance._rawTokenPreProgrammedDistribution = rawInstance;
        return instance;
    }
}
