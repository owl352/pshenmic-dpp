import { TokenDistributionRecipientNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike } from '../../types.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class TokenDistributionRecipientWASM {
  /** @private **/
  _rawTokenDistributionRecipient: TokenDistributionRecipientNAPI

  private constructor (rawInstance: TokenDistributionRecipientNAPI) {
    this._rawTokenDistributionRecipient = rawInstance
  }

  getType (): string {
    return this._rawTokenDistributionRecipient.getType()
  }

  getValue (): IdentifierWASM | undefined {
    const value = this._rawTokenDistributionRecipient.getValue()

    if (value !== undefined) {
      return IdentifierWASM.createFromRawInstance(value)
    }
  }

  static ContractOwner (): TokenDistributionRecipientWASM {
    return new TokenDistributionRecipientWASM(
      dppProvider.dpp.TokenDistributionRecipientNAPI.ContractOwner()
    )
  }

  static Identity (id: IdentifierLike): TokenDistributionRecipientWASM {
    return new TokenDistributionRecipientWASM(
      dppProvider.dpp.TokenDistributionRecipientNAPI.Identity(
        prepareIdentifierValue(id)
      )
    )
  }

  static EvonodesByParticipation (): TokenDistributionRecipientWASM {
    return new TokenDistributionRecipientWASM(
      dppProvider.dpp.TokenDistributionRecipientNAPI.EvonodesByParticipation()
    )
  }

  static createFromRawInstance (rawInstance: TokenDistributionRecipientNAPI): TokenDistributionRecipientWASM {
    return new TokenDistributionRecipientWASM(rawInstance)
  }
}
