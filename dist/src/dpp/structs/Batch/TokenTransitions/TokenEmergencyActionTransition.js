import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { dppProvider } from '../../../provider.js';
import { valueToDynamicValue } from '../../../utils.js';
export class TokenEmergencyActionTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, emergencyAction, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenEmergencyActionTransitionNAPI(base._rawTokenBaseTransition, valueToDynamicValue(emergencyAction), publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get emergencyAction() {
        return this._rawTransition.emergencyAction;
    }
    set emergencyAction(value) {
        this._rawTransition.emergencyAction = valueToDynamicValue(value);
    }
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenEmergencyActionTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
