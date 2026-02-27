import type { ChangeControlRulesNAPI } from '../../../../binaries/bindingsTypes.js';
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js';
import { ActionGoalLike, IdentifierLike } from '../../types.js';
import { GroupWASM } from './Group.js';
import { ActionTakerWASM } from './ActionTaker.js';
export declare class ChangeControlRulesWASM {
    _rawChangeControlRules: ChangeControlRulesNAPI;
    constructor(authorizedToMakeChanges: AuthorizedActionTakersWASM, adminActionTakers: AuthorizedActionTakersWASM, changingAuthorizedActionTakersToNoOneAllowed: boolean, changingAdminActionTakersToNoOneAllowed: boolean, selfChangingAdminActionTakersAllowed: boolean);
    get authorizedToMakeChange(): AuthorizedActionTakersWASM;
    set authorizedToMakeChange(value: AuthorizedActionTakersWASM);
    get adminActionTakers(): AuthorizedActionTakersWASM;
    set adminActionTakers(value: AuthorizedActionTakersWASM);
    get changingAuthorizedActionTakersToNoOneAllowed(): boolean;
    set changingAuthorizedActionTakersToNoOneAllowed(value: boolean);
    get changingAdminActionTakersToNoOneAllowed(): boolean;
    set changingAdminActionTakersToNoOneAllowed(value: boolean);
    get selfChangingAdminActionTakersAllowed(): boolean;
    set selfChangingAdminActionTakersAllowed(value: boolean);
    canChangeAdminActionTakers(adminActionTakers: AuthorizedActionTakersWASM, contractOwnerId: IdentifierLike, groups: {
        [key: number]: GroupWASM;
    }, actionTaker: ActionTakerWASM, goal: ActionGoalLike, mainGroup?: number): boolean;
    static createFromRawInstance(rawInstance: ChangeControlRulesNAPI): ChangeControlRulesWASM;
}
