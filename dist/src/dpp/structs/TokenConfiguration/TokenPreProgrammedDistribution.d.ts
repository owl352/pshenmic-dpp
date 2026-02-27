import type { TokenPreProgrammedDistributionNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class TokenPreProgrammedDistributionWASM {
    /** @private **/
    _rawTokenPreProgrammedDistribution: TokenPreProgrammedDistributionNAPI;
    constructor(distributions: {
        [timestamp: string]: {
            [identifier: string]: bigint;
        };
    });
    get distributions(): {
        [timestamp: string]: {
            [identifier: string]: bigint;
        };
    };
    set distributions(distributions: {
        [timestamp: string]: {
            [identifier: string]: bigint;
        };
    });
    static createFromRawInstance(rawInstance: TokenPreProgrammedDistributionNAPI): TokenPreProgrammedDistributionWASM;
}
