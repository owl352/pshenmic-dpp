import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class ResourceVoteChoiceWASM {
    /** @private **/
    _rawResourceVoteChoice;
    constructor(rawResourceVoteChoice) {
        this._rawResourceVoteChoice = rawResourceVoteChoice;
    }
    getValue() {
        const val = this._rawResourceVoteChoice.getValue();
        return val != null ? IdentifierWASM.createFromRawInstance(val) : undefined;
    }
    getType() {
        return this._rawResourceVoteChoice.getType();
    }
    static TowardsIdentity(id) {
        return ResourceVoteChoiceWASM.createFromRawInstance(dppProvider.dpp.ResourceVoteChoiceNAPI.TowardsIdentity(prepareIdentifierValue(id)));
    }
    static Abstain() {
        return ResourceVoteChoiceWASM.createFromRawInstance(dppProvider.dpp.ResourceVoteChoiceNAPI.Abstain());
    }
    static Lock() {
        return ResourceVoteChoiceWASM.createFromRawInstance(dppProvider.dpp.ResourceVoteChoiceNAPI.Lock());
    }
    static createFromRawInstance(rawInstance) {
        return new ResourceVoteChoiceWASM(rawInstance);
    }
}
