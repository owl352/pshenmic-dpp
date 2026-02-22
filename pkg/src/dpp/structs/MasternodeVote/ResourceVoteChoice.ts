import { ResourceVoteChoiceNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class ResourceVoteChoiceWASM {
  /** @private **/
  _rawResourceVoteChoice: ResourceVoteChoiceNAPI

  private constructor (rawResourceVoteChoice: ResourceVoteChoiceNAPI) {
    this._rawResourceVoteChoice = rawResourceVoteChoice
  }

  getValue (): IdentifierWASM | undefined {
    const val = this._rawResourceVoteChoice.getValue()

    return val != null ? IdentifierWASM.createFromRawInstance(val) : undefined
  }

  getType (): string {
    return this._rawResourceVoteChoice.getType()
  }

  static TowardsIdentity (id: IdentifierLike): ResourceVoteChoiceWASM {
    return ResourceVoteChoiceWASM.createFromRawInstance(
      dppProvider.dpp.ResourceVoteChoiceNAPI.TowardsIdentity(prepareIdentifierValue(id))
    )
  }

  static Abstain (): ResourceVoteChoiceWASM {
    return ResourceVoteChoiceWASM.createFromRawInstance(
      dppProvider.dpp.ResourceVoteChoiceNAPI.Abstain()
    )
  }

  static Lock (): ResourceVoteChoiceWASM {
    return ResourceVoteChoiceWASM.createFromRawInstance(
      dppProvider.dpp.ResourceVoteChoiceNAPI.Lock()
    )
  }

  static createFromRawInstance (rawInstance: ResourceVoteChoiceNAPI): ResourceVoteChoiceWASM {
    return new ResourceVoteChoiceWASM(rawInstance)
  }
}
