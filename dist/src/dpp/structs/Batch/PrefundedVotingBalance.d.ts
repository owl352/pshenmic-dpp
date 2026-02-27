import type { PrefundedVotingBalanceNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class PrefundedVotingBalanceWASM {
    /** @private **/
    _rawPrefundedVotingBalance: PrefundedVotingBalanceNAPI;
    constructor(indexName: string, credits: bigint);
    get indexName(): string;
    get credits(): bigint;
    static createFromRawInstance(rawInstance: PrefundedVotingBalanceNAPI): PrefundedVotingBalanceWASM;
}
