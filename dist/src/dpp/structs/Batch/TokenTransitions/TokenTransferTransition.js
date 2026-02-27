import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { SharedEncryptedNoteWASM } from '../../EncryptedNote/SharedEncryptedNote.js';
import { PrivateEncryptedNoteWASM } from '../../EncryptedNote/PrivateEncryptedNote.js';
import { dppProvider } from '../../../provider.js';
import { prepareIdentifierValue } from '../../../utils.js';
import { IdentifierWASM } from '../../Identifier.js';
export class TokenTransferTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, recipientId, amount, publicNote, sharedEncryptedNote, privateEncryptedNote) {
        this._rawTransition = new dppProvider.dpp.TokenTransferTransitionNAPI(base._rawTokenBaseTransition, prepareIdentifierValue(recipientId), amount.toString(), publicNote, sharedEncryptedNote?._rawSharedNote, privateEncryptedNote?._rawEncryptedNote);
    }
    get recipientId() {
        return IdentifierWASM.createFromRawInstance(this._rawTransition.recipientId);
    }
    set recipientId(value) {
        this._rawTransition.recipientId = prepareIdentifierValue(value);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get amount() {
        return BigInt(this._rawTransition.amount);
    }
    set amount(value) {
        this._rawTransition.amount = value.toString();
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    get sharedEncryptedNote() {
        const note = this._rawTransition.sharedEncryptedNote;
        if (note != null) {
            return SharedEncryptedNoteWASM.createFromRawInstance(note);
        }
    }
    set sharedEncryptedNote(value) {
        this._rawTransition.sharedEncryptedNote = value?._rawSharedNote;
    }
    get privateEncryptedNote() {
        const note = this._rawTransition.privateEncryptedNote;
        if (note != null) {
            return PrivateEncryptedNoteWASM.createFromRawInstance(note);
        }
    }
    set privateEncryptedNote(value) {
        this._rawTransition.privateEncryptedNote = value?._rawEncryptedNote;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenTransferTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
