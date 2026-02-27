import { dppProvider } from '../../provider.js';
export class PrefundedVotingBalanceWASM {
    /** @private **/
    _rawPrefundedVotingBalance;
    constructor(indexName, credits) {
        this._rawPrefundedVotingBalance = new dppProvider.dpp.PrefundedVotingBalanceNAPI(indexName, credits?.toString());
    }
    get indexName() {
        return this._rawPrefundedVotingBalance.indexName;
    }
    get credits() {
        return BigInt(this._rawPrefundedVotingBalance.credits);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PrefundedVotingBalanceWASM.prototype);
        instance._rawPrefundedVotingBalance = rawInstance;
        return instance;
    }
}
