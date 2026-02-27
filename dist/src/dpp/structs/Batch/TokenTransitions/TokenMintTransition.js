import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
import { prepareIdentifierValue } from '../../../utils.js';
import { IdentifierWASM } from '../../Identifier.js';
export class TokenMintTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, issueToIdentityId, amount, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenMintTransitionNAPI(base._rawTokenBaseTransition, issueToIdentityId != null ? prepareIdentifierValue(issueToIdentityId) : undefined, amount.toString(), publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get issuedToIdentityId() {
        const id = this._rawTransition.issuedToIdentityId;
        if (id != null) {
            return IdentifierWASM.createFromRawInstance(id);
        }
    }
    set issuedToIdentityId(value) {
        this._rawTransition.issuedToIdentityId = value != null ? prepareIdentifierValue(value) : undefined;
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
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenMintTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
