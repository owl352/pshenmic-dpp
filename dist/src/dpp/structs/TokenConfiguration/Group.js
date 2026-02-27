import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export class GroupWASM {
    /** @private **/
    _rawGroup;
    constructor(members, requiredPower) {
        const keys = Object.keys(members);
        const normalMembers = [];
        for (const key of keys) {
            normalMembers.push([valueToDynamicValue(key), members[key]]);
        }
        this._rawGroup = new dppProvider.dpp.GroupNAPI(normalMembers, requiredPower);
    }
    get members() {
        const rawMembers = this._rawGroup.members;
        const out = {};
        for (const [id, power] of rawMembers) {
            out[id.base58()] = power;
        }
        return out;
    }
    set members(members) {
        const keys = Object.keys(members);
        const normalMembers = [];
        for (const key of keys) {
            normalMembers.push([valueToDynamicValue(key), members[key]]);
        }
        this._rawGroup.members = normalMembers;
    }
    get requiredPower() {
        return this._rawGroup.requiredPower;
    }
    set requiredPower(value) {
        this._rawGroup.requiredPower = value;
    }
    setMemberRequiredPower(member, power) {
        this._rawGroup.setMemberRequiredPower(prepareIdentifierValue(member), power);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(GroupWASM.prototype);
        instance._rawGroup = rawInstance;
        return instance;
    }
}
