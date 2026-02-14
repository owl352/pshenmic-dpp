import {ConsensusErrorNAPI} from "../../../binaries/bindingsTypes.js";
import {dppProvider} from "../provider.js";

export class ConsensusErrorWASM {
  /** @private **/
  _rawConsensusError: ConsensusErrorNAPI

  private constructor(rawData: Uint8Array | ConsensusErrorWASM | ConsensusErrorNAPI) {
    const dpp = dppProvider.getDpp()

    if (rawData instanceof ConsensusErrorNAPI) {
      this._rawConsensusError = rawData
    } else if(rawData instanceof ConsensusErrorWASM) {
      this._rawConsensusError = rawData._rawConsensusError
    } else {
      this._rawConsensusError = dpp.ConsensusErrorNAPI.deserialize(rawData)
    }
  }

  static deserialize(error: Uint8Array): ConsensusErrorWASM {
    const dpp = dppProvider.getDpp()

    return new ConsensusErrorWASM(dpp.ConsensusErrorNAPI.deserialize(error))
  }

  message(): string {
    return this._rawConsensusError.message
  }
}
