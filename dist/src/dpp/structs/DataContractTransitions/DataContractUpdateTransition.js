import { DataContractWASM } from '../DataContract.js';
import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class DataContractUpdateTransitionWASM {
    /** @private **/
    _rawDataContractUpdateTransition;
    constructor(dataContract, identityNonce, platformVersion) {
        this._rawDataContractUpdateTransition = new dppProvider.dpp.DataContractUpdateTransitionNAPI(dataContract._rawDataContract, identityNonce.toString(), valueToDynamicValue(platformVersion));
    }
    get featureVersion() {
        return this._rawDataContractUpdateTransition.featureVersion;
    }
    get identityContractNonce() {
        return BigInt(this._rawDataContractUpdateTransition.identityContractNonce);
    }
    verifyProtocolVersion(protocolVersion) {
        return this._rawDataContractUpdateTransition.verifyProtocolVersion(protocolVersion);
    }
    setDataContract(dataContract, platformVersion) {
        this._rawDataContractUpdateTransition.setDataContract(dataContract._rawDataContract, valueToDynamicValue(platformVersion));
    }
    getDataContract(fullValidation, platformVersion) {
        return DataContractWASM.createFromRawInstance(this._rawDataContractUpdateTransition.getDataContract(fullValidation, valueToDynamicValue(platformVersion)));
    }
    bytes() {
        return this._rawDataContractUpdateTransition.bytes();
    }
    hex() {
        return this._rawDataContractUpdateTransition.hex();
    }
    base64() {
        return this._rawDataContractUpdateTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawDataContractUpdateTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return DataContractUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractUpdateTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return DataContractUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractUpdateTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return DataContractUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractUpdateTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return DataContractUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DataContractUpdateTransitionWASM.prototype);
        instance._rawDataContractUpdateTransition = rawInstance;
        return instance;
    }
}
