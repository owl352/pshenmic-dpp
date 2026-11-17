import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
import { prepareIdentifierValue } from '../../../utils.js';
import { IdentifierWASM } from '../../Identifier.js';
export class TokenUnFreezeTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, frozenIdentityId, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenUnFreezeTransitionNAPI(base._rawTokenBaseTransition, prepareIdentifierValue(frozenIdentityId), publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get frozenIdentityId() {
        return IdentifierWASM.createFromRawInstance(this._rawTransition.frozenIdentityId);
    }
    set frozenIdentityId(value) {
        this._rawTransition.frozenIdentityId = prepareIdentifierValue(value);
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenUnFreezeTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
