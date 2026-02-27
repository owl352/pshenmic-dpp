import type { VoteNAPI } from '../../../../binaries/bindingsTypes.js';
import { VotePollWASM } from './VotePoll.js';
import { ResourceVoteChoiceWASM } from './ResourceVoteChoice.js';
export declare class VoteWASM {
    /** @private **/
    _rawVote: VoteNAPI;
    constructor(votePoll: VotePollWASM, resourceVoteChoice: ResourceVoteChoiceWASM);
    get votePoll(): VotePollWASM;
    set votePoll(votePoll: VotePollWASM);
    get resourceVoteChoice(): ResourceVoteChoiceWASM;
    set resourceVoteChoice(resourceVoteChoice: ResourceVoteChoiceWASM);
    static createFromRawInstance(rawInstance: VoteNAPI): VoteWASM;
}
