import { prepareIdentifierValue } from '../../utils.js';
import { dppProvider } from '../../provider.js';
import { IdentifierWASM } from '../Identifier.js';
export class ActionTakerWASM {
    /** @private **/
    _rawActionTaker;
    constructor(value) {
        let normalValue;
        if (Array.isArray(value)) {
            normalValue = value.map(id => prepareIdentifierValue(id));
        }
        else {
            normalValue = prepareIdentifierValue(value);
        }
        this._rawActionTaker = new dppProvider.dpp.ActionTakerNAPI(normalValue);
    }
    getType() {
        return this._rawActionTaker.getType();
    }
    get value() {
        const v = this._rawActionTaker.value;
        if (Array.isArray(v)) {
            return v.map(IdentifierWASM.createFromRawInstance);
        }
        else {
            return IdentifierWASM.createFromRawInstance(v);
        }
    }
    set value(value) {
        let normalValue;
        if (Array.isArray(value)) {
            normalValue = value.map(id => prepareIdentifierValue(id));
        }
        else {
            normalValue = prepareIdentifierValue(value);
        }
        this._rawActionTaker.value = normalValue;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ActionTakerWASM.prototype);
        instance._rawActionTaker = rawInstance;
        return instance;
    }
}
