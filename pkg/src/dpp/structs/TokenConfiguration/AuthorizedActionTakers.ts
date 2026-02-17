import { AuthorizedActionTakersNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike } from '../../types.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class AuthorizedActionTakersWASM {
  /** @private **/
  _rawAuthorizedActionTakers: AuthorizedActionTakersNAPI

  private constructor (authorizedActionTakers: AuthorizedActionTakersNAPI) {
    this._rawAuthorizedActionTakers = authorizedActionTakers
  }

  getTakerType (): string {
    return this._rawAuthorizedActionTakers.getTakerType()
  }

  getValue (): undefined | IdentifierWASM | number {
    const value = this._rawAuthorizedActionTakers.getValue()

    if (value === undefined) {
      return undefined
    } else if (typeof value === 'number') {
      return Number(value)
    } else {
      return IdentifierWASM.createFromRawInstance(value)
    }
  }

  static NoOne (): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(
      dppProvider.dpp.AuthorizedActionTakersNAPI.NoOne()
    )
  }

  static ContractOwner (): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(
      dppProvider.dpp.AuthorizedActionTakersNAPI.ContractOwner()
    )
  }

  static Identity (id: IdentifierLike): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(
      dppProvider.dpp.AuthorizedActionTakersNAPI.Identity(prepareIdentifierValue(id))
    )
  }

  static MainGroup (): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(
      dppProvider.dpp.AuthorizedActionTakersNAPI.MainGroup()
    )
  }

  static Group (groupContractPosition: number): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(
      dppProvider.dpp.AuthorizedActionTakersNAPI.Group(groupContractPosition)
    )
  }

  static createFromRawInstance (rawInstance: AuthorizedActionTakersNAPI): AuthorizedActionTakersWASM {
    return new AuthorizedActionTakersWASM(rawInstance)
  }
}
