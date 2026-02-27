import { DocumentCreateTransitionWASM } from './DocumentTransitions/DocumentCreateTransition.js';
import { DocumentReplaceTransitionWASM } from './DocumentTransitions/DocumentReplaceTransition.js';
import { DocumentDeleteTransitionWASM } from './DocumentTransitions/DocumentDeleteTransition.js';
import { DocumentPurchaseTransitionWASM } from './DocumentTransitions/DocumentPurchaseTransition.js';
import { DocumentTransferTransitionWASM } from './DocumentTransitions/DocumentTransferTransition.js';
import { DocumentUpdatePriceTransitionWASM } from './DocumentTransitions/DocumentUpdatePriceTransition.js';
import { IdentifierWASM } from '../Identifier.js';
import { prepareIdentifierValue } from '../../utils.js';
export class DocumentTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(transition) {
        this._rawTransition = transition.toDocumentTransition()._rawTransition;
    }
    get actionType() {
        return this._rawTransition.actionType;
    }
    get actionTypeNumber() {
        return this._rawTransition.actionTypeNumber;
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTransition.dataContractId);
    }
    set dataContractId(value) {
        this._rawTransition.dataContractId = prepareIdentifierValue(value);
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawTransition.id);
    }
    get documentTypeName() {
        return this._rawTransition.documentTypeName;
    }
    get identityContractNonce() {
        return BigInt(this._rawTransition.identityContractNonce);
    }
    set identityContractNonce(value) {
        this._rawTransition.identityContractNonce = value.toString();
    }
    get revision() {
        const rev = this._rawTransition.revision;
        if (rev != null) {
            return BigInt(rev);
        }
    }
    set revision(value) {
        this._rawTransition.revision = value.toString();
    }
    get entropy() {
        return this._rawTransition.entropy ?? undefined;
    }
    get createTransition() {
        return DocumentCreateTransitionWASM.createFromRawInstance(this._rawTransition.createTransition);
    }
    get deleteTransition() {
        return DocumentDeleteTransitionWASM.createFromRawInstance(this._rawTransition.deleteTransition);
    }
    get purchaseTransition() {
        return DocumentPurchaseTransitionWASM.createFromRawInstance(this._rawTransition.purchaseTransition);
    }
    get replaceTransition() {
        return DocumentReplaceTransitionWASM.createFromRawInstance(this._rawTransition.replaceTransition);
    }
    get transferTransition() {
        return DocumentTransferTransitionWASM.createFromRawInstance(this._rawTransition.transferTransition);
    }
    get updatePriceTransition() {
        return DocumentUpdatePriceTransitionWASM.createFromRawInstance(this._rawTransition.updatePriceTransition);
    }
    idDocumentTransition() {
        return true;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
