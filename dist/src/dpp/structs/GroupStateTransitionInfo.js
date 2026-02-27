import { dppProvider } from '../provider.js';
import { prepareIdentifierValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
export class GroupStateTransitionInfoWASM {
    /** @private **/
    _rawGroupStateTransitionInfo;
    constructor(groupContractPosition, actionId, actionIsProposer) {
        this._rawGroupStateTransitionInfo = new dppProvider.dpp.GroupStateTransitionInfoNAPI(groupContractPosition, prepareIdentifierValue(actionId), actionIsProposer);
    }
    get groupContractPosition() {
        return this._rawGroupStateTransitionInfo.groupContractPosition;
    }
    set groupContractPosition(groupContractPosition) {
        this._rawGroupStateTransitionInfo.groupContractPosition = groupContractPosition;
    }
    get actionId() {
        return IdentifierWASM.createFromRawInstance(this._rawGroupStateTransitionInfo.actionId);
    }
    set actionId(actionId) {
        this._rawGroupStateTransitionInfo.actionId = prepareIdentifierValue(actionId);
    }
    get actionIsProposer() {
        return this._rawGroupStateTransitionInfo.actionIsProposer;
    }
    set actionIsProposer(actionIsProposer) {
        this._rawGroupStateTransitionInfo.actionIsProposer = actionIsProposer;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(GroupStateTransitionInfoWASM.prototype);
        instance._rawGroupStateTransitionInfo = rawInstance;
        return instance;
    }
}
