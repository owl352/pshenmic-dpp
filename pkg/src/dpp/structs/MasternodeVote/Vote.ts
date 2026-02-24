import type { VoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { VotePollWASM } from './VotePoll.js'
import { ResourceVoteChoiceWASM } from './ResourceVoteChoice.js'

export class VoteWASM {
  /** @private **/
  _rawVote: VoteNAPI

  constructor (votePoll: VotePollWASM, resourceVoteChoice: ResourceVoteChoiceWASM) {
    this._rawVote = new dppProvider.dpp.VoteNAPI(votePoll._rawVotePollWASM, resourceVoteChoice._rawResourceVoteChoice)
  }

  get votePoll (): VotePollWASM {
    return VotePollWASM.createFromRawInstance(this._rawVote.votePoll)
  }

  set votePoll (votePoll: VotePollWASM) {
    this._rawVote.votePoll = votePoll._rawVotePollWASM
  }

  get resourceVoteChoice (): ResourceVoteChoiceWASM {
    return ResourceVoteChoiceWASM.createFromRawInstance(this._rawVote.resourceVoteChoice)
  }

  set resourceVoteChoice (resourceVoteChoice: ResourceVoteChoiceWASM) {
    this._rawVote.resourceVoteChoice = resourceVoteChoice._rawResourceVoteChoice
  }

  static createFromRawInstance (rawInstance: VoteNAPI): VoteWASM {
    const instance: VoteWASM = Object.create(VoteWASM.prototype)
    instance._rawVote = rawInstance

    return instance
  }
}
