import { PrefundedVotingBalanceWASM } from '../PrefundedVotingBalance.js';
import { dppProvider } from '../../../provider.js';
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js';
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js';
import { DocumentTransitionWASM } from '../DocumentTransition.js';
export class DocumentCreateTransitionWASM {
    /** @private **/
    _rawDocumentCreateTransition;
    constructor(document, identityContractNonce, prefundedVotingBalance, tokenPaymentInfo) {
        this._rawDocumentCreateTransition = new dppProvider.dpp.DocumentCreateTransitionNAPI(document._rawDocument, identityContractNonce.toString(), prefundedVotingBalance?._rawPrefundedVotingBalance, tokenPaymentInfo?._rawTokenPaymentInfo);
    }
    get data() {
        return valueFromDynamicValue(this._rawDocumentCreateTransition.data);
    }
    set data(value) {
        this._rawDocumentCreateTransition.data = valueToDynamicValue(value);
    }
    get base() {
        return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentCreateTransition.base);
    }
    set base(value) {
        this._rawDocumentCreateTransition.base = value._rawDocumentBaseTransition;
    }
    get entropy() {
        return this._rawDocumentCreateTransition.entropy;
    }
    set entropy(value) {
        this._rawDocumentCreateTransition.entropy = value;
    }
    get prefundedVotingBalance() {
        const balance = this._rawDocumentCreateTransition.prefundedVotingBalance;
        if (balance != null) {
            return PrefundedVotingBalanceWASM.createFromRawInstance(balance);
        }
    }
    set prefundedVotingBalance(value) {
        if (value != null) {
            this._rawDocumentCreateTransition.prefundedVotingBalance = value._rawPrefundedVotingBalance;
        }
        else {
            this._rawDocumentCreateTransition.clearPrefundedVotingBalance();
        }
    }
    clearPrefundedVotingBalance() {
        this._rawDocumentCreateTransition.clearPrefundedVotingBalance();
    }
    toDocumentTransition() {
        return DocumentTransitionWASM.createFromRawInstance(this._rawDocumentCreateTransition.toDocumentTransition());
    }
    static fromDocumentTransition(transition) {
        return DocumentCreateTransitionWASM.createFromRawInstance(dppProvider.dpp.DocumentCreateTransitionNAPI.fromDocumentTransition(transition._rawTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentCreateTransitionWASM.prototype);
        instance._rawDocumentCreateTransition = rawInstance;
        return instance;
    }
}
