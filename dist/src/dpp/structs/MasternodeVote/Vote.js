import { dppProvider } from '../../provider.js';
import { VotePollWASM } from './VotePoll.js';
import { ResourceVoteChoiceWASM } from './ResourceVoteChoice.js';
export class VoteWASM {
    /** @private **/
    _rawVote;
    constructor(votePoll, resourceVoteChoice) {
        this._rawVote = new dppProvider.dpp.VoteNAPI(votePoll._rawVotePollWASM, resourceVoteChoice._rawResourceVoteChoice);
    }
    get votePoll() {
        return VotePollWASM.createFromRawInstance(this._rawVote.votePoll);
    }
    set votePoll(votePoll) {
        this._rawVote.votePoll = votePoll._rawVotePollWASM;
    }
    get resourceVoteChoice() {
        return ResourceVoteChoiceWASM.createFromRawInstance(this._rawVote.resourceVoteChoice);
    }
    set resourceVoteChoice(resourceVoteChoice) {
        this._rawVote.resourceVoteChoice = resourceVoteChoice._rawResourceVoteChoice;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(VoteWASM.prototype);
        instance._rawVote = rawInstance;
        return instance;
    }
}
