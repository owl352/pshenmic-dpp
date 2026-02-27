import type { GroupStateTransitionInfoNAPI } from '../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../types.js';
import { IdentifierWASM } from './Identifier.js';
export declare class GroupStateTransitionInfoWASM {
    /** @private **/
    _rawGroupStateTransitionInfo: GroupStateTransitionInfoNAPI;
    constructor(groupContractPosition: number, actionId: IdentifierLike, actionIsProposer: boolean);
    get groupContractPosition(): number;
    set groupContractPosition(groupContractPosition: number);
    get actionId(): IdentifierWASM;
    set actionId(actionId: IdentifierLike);
    get actionIsProposer(): boolean;
    set actionIsProposer(actionIsProposer: boolean);
    static createFromRawInstance(rawInstance: GroupStateTransitionInfoNAPI): GroupStateTransitionInfoWASM;
}
