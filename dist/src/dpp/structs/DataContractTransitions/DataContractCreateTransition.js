import { DataContractWASM } from '../DataContract.js';
import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class DataContractCreateTransitionWASM {
    /** @private **/
    _rawDataContractCreateTransition;
    constructor(dataContract, identityNonce, platformVersion) {
        this._rawDataContractCreateTransition = new dppProvider.dpp.DataContractCreateTransitionNAPI(dataContract._rawDataContract, identityNonce.toString(), valueToDynamicValue(platformVersion));
    }
    get featureVersion() {
        return this._rawDataContractCreateTransition.featureVersion;
    }
    get identityNonce() {
        return BigInt(this._rawDataContractCreateTransition.identityNonce);
    }
    verifyProtocolVersion(protocolVersion) {
        return this._rawDataContractCreateTransition.verifyProtocolVersion(protocolVersion);
    }
    setDataContract(dataContract, platformVersion) {
        this._rawDataContractCreateTransition.setDataContract(dataContract._rawDataContract, valueToDynamicValue(platformVersion));
    }
    getDataContract(platformVersion, fullValidation) {
        return DataContractWASM.createFromRawInstance(this._rawDataContractCreateTransition.getDataContract(valueToDynamicValue(platformVersion), fullValidation));
    }
    bytes() {
        return this._rawDataContractCreateTransition.bytes();
    }
    hex() {
        return this._rawDataContractCreateTransition.hex();
    }
    base64() {
        return this._rawDataContractCreateTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawDataContractCreateTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return DataContractCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractCreateTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return DataContractCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractCreateTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return DataContractCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractCreateTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return DataContractCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.DataContractCreateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DataContractCreateTransitionWASM.prototype);
        instance._rawDataContractCreateTransition = rawInstance;
        return instance;
    }
}
