import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
/** The epoch fee multiplier a document transition agrees to pay its action fee at, and how much it may grow before execution **/
export class AgreedFeeMultiplierWASM {
    /** @private **/
    _rawAgreedFeeMultiplier;
    constructor(knownPermille, increaseTolerancePercent) {
        this._rawAgreedFeeMultiplier = new dppProvider.dpp.AgreedFeeMultiplierNAPI(knownPermille.toString(), increaseTolerancePercent);
    }
    get knownPermille() {
        return BigInt(this._rawAgreedFeeMultiplier.knownPermille);
    }
    set knownPermille(value) {
        this._rawAgreedFeeMultiplier.knownPermille = value.toString();
    }
    get increaseTolerancePercent() {
        return this._rawAgreedFeeMultiplier.increaseTolerancePercent;
    }
    set increaseTolerancePercent(value) {
        this._rawAgreedFeeMultiplier.increaseTolerancePercent = value;
    }
    /** Whether the current epoch fee multiplier (permille) is within the agreed tolerance **/
    tolerates(currentPermille) {
        return this._rawAgreedFeeMultiplier.tolerates(currentPermille.toString());
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(AgreedFeeMultiplierWASM.prototype);
        instance._rawAgreedFeeMultiplier = rawInstance;
        return instance;
    }
}
/** The action fee a document transition agrees to pay to the contract fee pots (protocol version 14) **/
export class DocumentActionFeeAgreementWASM {
    /** @private **/
    _rawDocumentActionFeeAgreement;
    /** A fee multiplier makes the agreement priced by the epoch fee multiplier, none makes it fixed **/
    constructor(owner, moderators, feeMultiplier) {
        this._rawDocumentActionFeeAgreement = new dppProvider.dpp.DocumentActionFeeAgreementNAPI(owner.toString(), moderators.toString(), feeMultiplier?._rawAgreedFeeMultiplier);
    }
    /** The agreement to the fee the document type declares for the action, or undefined when the action charges no fee **/
    static forDocumentTypeAction(dataContract, documentTypeName, action, feeMultiplier) {
        const raw = dppProvider.dpp.DocumentActionFeeAgreementNAPI.forDocumentTypeAction(dataContract._rawDataContract, documentTypeName, valueToDynamicValue(action), feeMultiplier._rawAgreedFeeMultiplier);
        return raw != null ? DocumentActionFeeAgreementWASM.createFromRawInstance(raw) : undefined;
    }
    get owner() {
        return BigInt(this._rawDocumentActionFeeAgreement.owner);
    }
    set owner(value) {
        this._rawDocumentActionFeeAgreement.owner = value.toString();
    }
    get moderators() {
        return BigInt(this._rawDocumentActionFeeAgreement.moderators);
    }
    set moderators(value) {
        this._rawDocumentActionFeeAgreement.moderators = value.toString();
    }
    get feeMultiplier() {
        const multiplier = this._rawDocumentActionFeeAgreement.feeMultiplier;
        return multiplier != null ? AgreedFeeMultiplierWASM.createFromRawInstance(multiplier) : undefined;
    }
    set feeMultiplier(value) {
        this._rawDocumentActionFeeAgreement.feeMultiplier = value?._rawAgreedFeeMultiplier;
    }
    get pricing() {
        return this._rawDocumentActionFeeAgreement.pricing;
    }
    /**
     * Checks the agreement the way the network does before executing the transition: it must match the fee
     * the document type declares for the action, and, when priced by the fee multiplier, tolerate the current
     * epoch fee multiplier (from verifyEpochsInfoProof). An action that charges no fee always passes.
     * Agreements to an elected moderators discount are not covered.
     **/
    verify(dataContract, documentTypeName, action, currentFeeMultiplierPermille) {
        return this._rawDocumentActionFeeAgreement.verify(dataContract._rawDataContract, documentTypeName, valueToDynamicValue(action), currentFeeMultiplierPermille?.toString());
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentActionFeeAgreementWASM.prototype);
        instance._rawDocumentActionFeeAgreement = rawInstance;
        return instance;
    }
}
