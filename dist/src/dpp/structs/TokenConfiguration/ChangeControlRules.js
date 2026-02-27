import { dppProvider } from '../../provider.js';
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export class ChangeControlRulesWASM {
    _rawChangeControlRules;
    constructor(authorizedToMakeChanges, adminActionTakers, changingAuthorizedActionTakersToNoOneAllowed, changingAdminActionTakersToNoOneAllowed, selfChangingAdminActionTakersAllowed) {
        this._rawChangeControlRules = new dppProvider.dpp.ChangeControlRulesNAPI(authorizedToMakeChanges._rawAuthorizedActionTakers, adminActionTakers._rawAuthorizedActionTakers, changingAuthorizedActionTakersToNoOneAllowed, changingAdminActionTakersToNoOneAllowed, selfChangingAdminActionTakersAllowed);
    }
    get authorizedToMakeChange() {
        return AuthorizedActionTakersWASM.createFromRawInstance(this._rawChangeControlRules.authorizedToMakeChange);
    }
    set authorizedToMakeChange(value) {
        this._rawChangeControlRules.authorizedToMakeChange = value._rawAuthorizedActionTakers;
    }
    get adminActionTakers() {
        return AuthorizedActionTakersWASM.createFromRawInstance(this._rawChangeControlRules.adminActionTakers);
    }
    set adminActionTakers(value) {
        this._rawChangeControlRules.adminActionTakers = value._rawAuthorizedActionTakers;
    }
    get changingAuthorizedActionTakersToNoOneAllowed() {
        return this._rawChangeControlRules.changingAuthorizedActionTakersToNoOneAllowed;
    }
    set changingAuthorizedActionTakersToNoOneAllowed(value) {
        this._rawChangeControlRules.changingAuthorizedActionTakersToNoOneAllowed = value;
    }
    get changingAdminActionTakersToNoOneAllowed() {
        return this._rawChangeControlRules.changingAdminActionTakersToNoOneAllowed;
    }
    set changingAdminActionTakersToNoOneAllowed(value) {
        this._rawChangeControlRules.changingAdminActionTakersToNoOneAllowed = value;
    }
    get selfChangingAdminActionTakersAllowed() {
        return this._rawChangeControlRules.selfChangingAdminActionTakersAllowed;
    }
    set selfChangingAdminActionTakersAllowed(value) {
        this._rawChangeControlRules.selfChangingAdminActionTakersAllowed = value;
    }
    canChangeAdminActionTakers(adminActionTakers, contractOwnerId, groups, actionTaker, goal, mainGroup) {
        const keys = Object.keys(groups);
        const normalGroups = [];
        for (const key of keys) {
            normalGroups.push([Number(key), groups[Number(key)]._rawGroup]);
        }
        return this._rawChangeControlRules.canChangeAdminActionTakers(adminActionTakers._rawAuthorizedActionTakers, prepareIdentifierValue(contractOwnerId), mainGroup, normalGroups, actionTaker._rawActionTaker, valueToDynamicValue(goal));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ChangeControlRulesWASM.prototype);
        instance._rawChangeControlRules = rawInstance;
        return instance;
    }
}
