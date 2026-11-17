import { GroupStateTransitionInfoWASM } from '../GroupStateTransitionInfo.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class TokenBaseTransitionWASM {
    /** @private **/
    _rawTokenBaseTransition;
    constructor(identityContractNonce, tokenContractPosition, dataContractId, tokenId, usingGroupInfo) {
        this._rawTokenBaseTransition = new dppProvider.dpp.TokenBaseTransitionNAPI(identityContractNonce.toString(), tokenContractPosition, prepareIdentifierValue(dataContractId), prepareIdentifierValue(tokenId), usingGroupInfo?._rawGroupStateTransitionInfo);
    }
    get identityContractNonce() {
        return BigInt(this._rawTokenBaseTransition.identityContractNonce);
    }
    set identityContractNonce(value) {
        this._rawTokenBaseTransition.identityContractNonce = value.toString();
    }
    get tokenContractPosition() {
        return this._rawTokenBaseTransition.tokenContractPosition;
    }
    set tokenContractPosition(value) {
        this._rawTokenBaseTransition.tokenContractPosition = value;
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenBaseTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTokenBaseTransition.dataContractId = prepareIdentifierValue(value);
    }
    get tokenId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenBaseTransition.tokenId);
    }
    set tokenId(value) {
        this._rawTokenBaseTransition.tokenId = prepareIdentifierValue(value);
    }
    get usingGroupInfo() {
        const info = this._rawTokenBaseTransition.usingGroupInfo;
        if (info != null) {
            return GroupStateTransitionInfoWASM.createFromRawInstance(info);
        }
    }
    set usingGroupInfo(value) {
        this._rawTokenBaseTransition.usingGroupInfo = value?._rawGroupStateTransitionInfo;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenBaseTransitionWASM.prototype);
        instance._rawTokenBaseTransition = rawInstance;
        return instance;
    }
}
