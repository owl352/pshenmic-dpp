import { dppProvider } from '../provider.js';
export class ConsensusErrorWASM {
    /** @private **/
    _rawConsensusError;
    constructor(rawData) {
        if (rawData instanceof dppProvider.dpp.ConsensusErrorNAPI) {
            this._rawConsensusError = rawData;
        }
        else if (rawData instanceof ConsensusErrorWASM) {
            this._rawConsensusError = rawData._rawConsensusError;
        }
        else {
            this._rawConsensusError = dppProvider.dpp.ConsensusErrorNAPI.deserialize(rawData);
        }
    }
    static deserialize(error) {
        return new ConsensusErrorWASM(dppProvider.dpp.ConsensusErrorNAPI.deserialize(error));
    }
    get message() {
        return this._rawConsensusError.message;
    }
}
