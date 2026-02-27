import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenConfigurationChangeItemWASM } from '../../TokenConfiguration/TokenConfigurationChangeItem.js';
import { dppProvider } from '../../../provider.js';
export class TokenConfigUpdateTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, updateTokenConfigurationItem, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenConfigUpdateTransitionNAPI(base._rawTokenBaseTransition, updateTokenConfigurationItem._rawTokenConfigurationChangeItem, publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    get updateTokenConfigurationItem() {
        return TokenConfigurationChangeItemWASM.createFromRawInstance(this._rawTransition.updateTokenConfigurationItem);
    }
    set updateTokenConfigurationItem(value) {
        this._rawTransition.updateTokenConfigurationItem = value._rawTokenConfigurationChangeItem;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenConfigUpdateTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
