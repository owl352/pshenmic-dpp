import type { GroupStateTransitionInfoNAPI } from '../../../binaries/bindingsTypes.js'
import { dppProvider } from '../provider.js'
import { IdentifierLike } from '../types.js'
import { prepareIdentifierValue } from '../utils.js'
import { IdentifierWASM } from './Identifier.js'

export class GroupStateTransitionInfoWASM {
  /** @private **/
  _rawGroupStateTransitionInfo: GroupStateTransitionInfoNAPI

  constructor (groupContractPosition: number, actionId: IdentifierLike, actionIsProposer: boolean) {
    this._rawGroupStateTransitionInfo = new dppProvider.dpp.GroupStateTransitionInfoNAPI(groupContractPosition, prepareIdentifierValue(actionId), actionIsProposer)
  }

  get groupContractPosition (): number {
    return this._rawGroupStateTransitionInfo.groupContractPosition
  }

  set groupContractPosition (groupContractPosition: number) {
    this._rawGroupStateTransitionInfo.groupContractPosition = groupContractPosition
  }

  get actionId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawGroupStateTransitionInfo.actionId)
  }

  set actionId (actionId: IdentifierLike) {
    this._rawGroupStateTransitionInfo.actionId = prepareIdentifierValue(actionId)
  }

  get actionIsProposer (): boolean {
    return this._rawGroupStateTransitionInfo.actionIsProposer
  }

  set actionIsProposer (actionIsProposer: boolean) {
    this._rawGroupStateTransitionInfo.actionIsProposer = actionIsProposer
  }

  static createFromRawInstance (rawInstance: GroupStateTransitionInfoNAPI): GroupStateTransitionInfoWASM {
    const instance: GroupStateTransitionInfoWASM = Object.create(GroupStateTransitionInfoWASM.prototype)
    instance._rawGroupStateTransitionInfo = rawInstance

    return instance
  }
}
