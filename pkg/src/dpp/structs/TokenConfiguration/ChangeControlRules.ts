import type { ChangeControlRulesNAPI, GroupNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { AuthorizedActionTakersWASM } from './AuthorizedActionTakers.js'
import { ActionGoalLike, IdentifierLike } from '../../types.js'
import { GroupWASM } from './Group.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { ActionTakerWASM } from './ActionTaker.js'

export class ChangeControlRulesWASM {
  _rawChangeControlRules: ChangeControlRulesNAPI

  constructor (
    authorizedToMakeChanges: AuthorizedActionTakersWASM,
    adminActionTakers: AuthorizedActionTakersWASM,
    changingAuthorizedActionTakersToNoOneAllowed: boolean,
    changingAdminActionTakersToNoOneAllowed: boolean,
    selfChangingAdminActionTakersAllowed: boolean
  ) {
    this._rawChangeControlRules = new dppProvider.dpp.ChangeControlRulesNAPI(
      authorizedToMakeChanges._rawAuthorizedActionTakers,
      adminActionTakers._rawAuthorizedActionTakers,
      changingAuthorizedActionTakersToNoOneAllowed,
      changingAdminActionTakersToNoOneAllowed,
      selfChangingAdminActionTakersAllowed
    )
  }

  get authorizedToMakeChange (): AuthorizedActionTakersWASM {
    return AuthorizedActionTakersWASM.createFromRawInstance(this._rawChangeControlRules.authorizedToMakeChange)
  }

  set authorizedToMakeChange (value: AuthorizedActionTakersWASM) {
    this._rawChangeControlRules.authorizedToMakeChange = value._rawAuthorizedActionTakers
  }

  get adminActionTakers (): AuthorizedActionTakersWASM {
    return AuthorizedActionTakersWASM.createFromRawInstance(this._rawChangeControlRules.adminActionTakers)
  }

  set adminActionTakers (value: AuthorizedActionTakersWASM) {
    this._rawChangeControlRules.adminActionTakers = value._rawAuthorizedActionTakers
  }

  get changingAuthorizedActionTakersToNoOneAllowed (): boolean {
    return this._rawChangeControlRules.changingAuthorizedActionTakersToNoOneAllowed
  }

  set changingAuthorizedActionTakersToNoOneAllowed (value: boolean) {
    this._rawChangeControlRules.changingAuthorizedActionTakersToNoOneAllowed = value
  }

  get changingAdminActionTakersToNoOneAllowed (): boolean {
    return this._rawChangeControlRules.changingAdminActionTakersToNoOneAllowed
  }

  set changingAdminActionTakersToNoOneAllowed (value: boolean) {
    this._rawChangeControlRules.changingAdminActionTakersToNoOneAllowed = value
  }

  get selfChangingAdminActionTakersAllowed (): boolean {
    return this._rawChangeControlRules.selfChangingAdminActionTakersAllowed
  }

  set selfChangingAdminActionTakersAllowed (value: boolean) {
    this._rawChangeControlRules.selfChangingAdminActionTakersAllowed = value
  }

  canChangeAdminActionTakers (
    adminActionTakers: AuthorizedActionTakersWASM,
    contractOwnerId: IdentifierLike,
    groups: { [key: number]: GroupWASM },
    actionTaker: ActionTakerWASM,
    goal: ActionGoalLike,
    mainGroup?: number
  ): boolean {
    const keys = Object.keys(groups)
    const normalGroups: Array<[number, GroupNAPI]> = []

    for (const key of keys) {
      normalGroups.push([Number(key), groups[Number(key)]._rawGroup])
    }

    return this._rawChangeControlRules.canChangeAdminActionTakers(
      adminActionTakers._rawAuthorizedActionTakers,
      prepareIdentifierValue(contractOwnerId),
      mainGroup,
      normalGroups,
      actionTaker._rawActionTaker,
      valueToDynamicValue(goal)
    )
  }

  static createFromRawInstance (rawInstance: ChangeControlRulesNAPI): ChangeControlRulesWASM {
    const instance: ChangeControlRulesWASM = Object.create(this.prototype)
    instance._rawChangeControlRules = rawInstance

    return instance
  }
}
