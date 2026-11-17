import { TokenPaymentInfoWASM } from './TokenPaymentInfo.js';
import { DocumentActionFeeAgreementWASM } from './DocumentActionFeeAgreement.js';
import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class DocumentBaseTransitionWASM {
    /** @private **/
    _rawDocumentBaseTransition;
    constructor(documentId, identityContractNonce, documentTypeName, dataContractId, tokenPaymentInfo, actionFeeAgreement) {
        this._rawDocumentBaseTransition = new dppProvider.dpp.DocumentBaseTransitionNAPI(prepareIdentifierValue(documentId), identityContractNonce?.toString(), documentTypeName, prepareIdentifierValue(dataContractId), tokenPaymentInfo?._rawTokenPaymentInfo, actionFeeAgreement?._rawDocumentActionFeeAgreement);
    }
    /** 2 when the base carries an action fee agreement (protocol version 14), 1 otherwise **/
    get featureVersion() {
        return this._rawDocumentBaseTransition.featureVersion;
    }
    get actionFeeAgreement() {
        const agreement = this._rawDocumentBaseTransition.actionFeeAgreement;
        return agreement != null ? DocumentActionFeeAgreementWASM.createFromRawInstance(agreement) : undefined;
    }
    /** Setting an agreement on a V0 / V1 base upgrades it to V2 **/
    set actionFeeAgreement(actionFeeAgreement) {
        if (actionFeeAgreement != null) {
            this._rawDocumentBaseTransition.actionFeeAgreement = actionFeeAgreement._rawDocumentActionFeeAgreement;
        }
        else {
            this._rawDocumentBaseTransition.clearActionFeeAgreement();
        }
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawDocumentBaseTransition.id);
    }
    set id(id) {
        this._rawDocumentBaseTransition.id = prepareIdentifierValue(id);
    }
    get identityContractNonce() {
        return BigInt(this._rawDocumentBaseTransition.identityContractNonce);
    }
    set identityContractNonce(identityContractNonce) {
        this._rawDocumentBaseTransition.identityContractNonce = identityContractNonce?.toString();
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawDocumentBaseTransition.dataContractId);
    }
    set dataContractId(id) {
        this._rawDocumentBaseTransition.dataContractId = prepareIdentifierValue(id);
    }
    get documentTypeName() {
        return this._rawDocumentBaseTransition.documentTypeName;
    }
    set documentTypeName(name) {
        this._rawDocumentBaseTransition.documentTypeName = name;
    }
    get tokenPaymentInfo() {
        const info = this._rawDocumentBaseTransition.tokenPaymentInfo;
        if (info != null) {
            return TokenPaymentInfoWASM.crateFromRawInstance(info);
        }
    }
    set tokenPaymentInfo(tokenPaymentInfo) {
        if (tokenPaymentInfo != null) {
            this._rawDocumentBaseTransition.tokenPaymentInfo = tokenPaymentInfo._rawTokenPaymentInfo;
        }
        else {
            this._rawDocumentBaseTransition.clearTokenPaymentInfo();
        }
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentBaseTransitionWASM.prototype);
        instance._rawDocumentBaseTransition = rawInstance;
        return instance;
    }
}
