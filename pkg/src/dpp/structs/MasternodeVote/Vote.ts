import type { VoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { VotePollWASM } from './VotePoll.js'
import { ResourceVoteChoiceWASM } from './ResourceVoteChoice.js'
import { IdentifierWASM } from '../Identifier.js'
import { IdentifierLike } from '../../types.js'
import { prepareIdentifierValue } from '../../utils.js'

export class VoteWASM {
  /** @private **/
  _rawVote: VoteNAPI

  constructor (votePoll: VotePollWASM, resourceVoteChoice: ResourceVoteChoiceWASM) {
    this._rawVote = new dppProvider.dpp.VoteNAPI(votePoll._rawVotePollWASM, resourceVoteChoice._rawResourceVoteChoice)
  }

  get pollId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawVote.pollId)
  }

  set pollId (pollId: IdentifierLike) {
    this._rawVote.pollId = prepareIdentifierValue(pollId)
  }

  get yesNoChoice (): 'yes' | 'no' | 'abstain' {
    return this._rawVote.yesNoChoice as 'yes' | 'no' | 'abstain'
  }

  set yesNoChoice (choice: 'yes' | 'no' | 'abstain') {
    this._rawVote.yesNoChoice = choice
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

  /** A yes/no vote (protocol version 15), naming its poll by id. */
  static fromYesNo (pollId: IdentifierLike, choice: 'yes' | 'no' | 'abstain'): VoteWASM {
    return VoteWASM.createFromRawInstance(
      dppProvider.dpp.VoteNAPI.fromYesNo(prepareIdentifierValue(pollId), choice)
    )
  }

  static createFromRawInstance (rawInstance: VoteNAPI): VoteWASM {
    const instance: VoteWASM = Object.create(VoteWASM.prototype)
    instance._rawVote = rawInstance

    return instance
  }
}
