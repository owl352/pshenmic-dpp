import type { ConsensusErrorNAPI } from '../../../binaries/bindingsTypes.js'
import { dppProvider } from '../provider.js'

export class ConsensusErrorWASM {
  /** @private **/
  _rawConsensusError: ConsensusErrorNAPI

  private constructor (rawData: Uint8Array | ConsensusErrorWASM | ConsensusErrorNAPI) {
    if (rawData instanceof dppProvider.dpp.ConsensusErrorNAPI) {
      this._rawConsensusError = rawData
    } else if (rawData instanceof ConsensusErrorWASM) {
      this._rawConsensusError = rawData._rawConsensusError
    } else {
      this._rawConsensusError = dppProvider.dpp.ConsensusErrorNAPI.deserialize(rawData)
    }
  }

  static deserialize (error: Uint8Array): ConsensusErrorWASM {
    return new ConsensusErrorWASM(dppProvider.dpp.ConsensusErrorNAPI.deserialize(error))
  }

  get message (): string {
    return this._rawConsensusError.message
  }
}
