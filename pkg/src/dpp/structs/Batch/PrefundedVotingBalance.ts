import type { PrefundedVotingBalanceNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class PrefundedVotingBalanceWASM {
  /** @private **/
  _rawPrefundedVotingBalance: PrefundedVotingBalanceNAPI

  constructor (indexName: string, credits: bigint) {
    this._rawPrefundedVotingBalance = new dppProvider.dpp.PrefundedVotingBalanceNAPI(indexName, credits?.toString())
  }

  get indexName (): string {
    return this._rawPrefundedVotingBalance.indexName
  }

  get credits (): bigint {
    return BigInt(this._rawPrefundedVotingBalance.credits)
  }

  static createFromRawInstance (rawInstance: PrefundedVotingBalanceNAPI): PrefundedVotingBalanceWASM {
    const instance: PrefundedVotingBalanceWASM = Object.create(PrefundedVotingBalanceWASM.prototype)
    instance._rawPrefundedVotingBalance = rawInstance

    return instance
  }
}
