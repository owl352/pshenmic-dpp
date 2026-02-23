import type {
  IdentifierLikeNAPI,
  TokenPreProgrammedDistributionNAPI
} from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'

function objectToDistributionArray (distributions: { [timestamp: string]: { [identifier: string]: bigint } }): Array<[string, Array<[IdentifierLikeNAPI, string]>]> {
  const timestamps = Object.keys(distributions)
  const normalDistribution: Array<[string, Array<[IdentifierLikeNAPI, string]>]> = []

  for (const timestamp of timestamps) {
    const ids = Object.keys(distributions[timestamp])
    const identifiersWithAmount: Array<[IdentifierLikeNAPI, string]> = []

    for (const identifier of ids) {
      identifiersWithAmount.push([prepareIdentifierValue(identifier), distributions[timestamp][identifier].toString()])
    }

    normalDistribution.push([timestamp, identifiersWithAmount])
  }

  return normalDistribution
}

export class TokenPreProgrammedDistributionWASM {
  /** @private **/
  _rawTokenPreProgrammedDistribution: TokenPreProgrammedDistributionNAPI

  constructor (distributions: { [timestamp: string]: { [identifier: string]: bigint } }) {
    this._rawTokenPreProgrammedDistribution = new dppProvider.dpp.TokenPreProgrammedDistributionNAPI(objectToDistributionArray(distributions))
  }

  get distributions (): { [timestamp: string]: { [identifier: string]: bigint } } {
    const distributions = this._rawTokenPreProgrammedDistribution.distributions
    const out: { [timestamp: string]: { [identifier: string]: bigint } } = {}

    for (const [timestamp, identifiers] of distributions) {
      const ids: { [key: string]: bigint } = {}
      for (const [id, amount] of identifiers) {
        ids[id.base58()] = BigInt(amount)
      }

      out[timestamp] = ids
    }

    return out
  }

  set distributions (distributions: { [timestamp: string]: { [identifier: string]: bigint } }) {
    this._rawTokenPreProgrammedDistribution.distributions = objectToDistributionArray(distributions)
  }

  static createFromRawInstance (rawInstance: TokenPreProgrammedDistributionNAPI): TokenPreProgrammedDistributionWASM {
    const instance: TokenPreProgrammedDistributionWASM = Object.create(this.prototype)
    instance._rawTokenPreProgrammedDistribution = rawInstance

    return instance
  }
}
