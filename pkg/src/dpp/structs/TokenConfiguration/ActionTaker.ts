import type { ActionTakerNAPI, IdentifierLikeNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { prepareIdentifierValue } from '../../utils.js'
import { dppProvider } from '../../provider.js'
import { IdentifierWASM } from '../Identifier.js'

export class ActionTakerWASM {
  /** @private **/
  _rawActionTaker: ActionTakerNAPI

  constructor (
    value: IdentifierLike | IdentifierLike[]
  ) {
    let normalValue: IdentifierLikeNAPI | IdentifierLikeNAPI[]

    if (Array.isArray(value)) {
      normalValue = value.map(id => prepareIdentifierValue(id))
    } else {
      normalValue = prepareIdentifierValue(value)
    }

    this._rawActionTaker = new dppProvider.dpp.ActionTakerNAPI(normalValue)
  }

  getType (): string {
    return this._rawActionTaker.getType()
  }

  get value (): IdentifierWASM | IdentifierWASM[] {
    const v = this._rawActionTaker.value

    if (Array.isArray(v)) {
      return v.map(IdentifierWASM.createFromRawInstance)
    } else {
      return IdentifierWASM.createFromRawInstance(v)
    }
  }

  set value (value: IdentifierLike | IdentifierLike[]) {
    let normalValue: IdentifierLikeNAPI | IdentifierLikeNAPI[]

    if (Array.isArray(value)) {
      normalValue = value.map(id => prepareIdentifierValue(id))
    } else {
      normalValue = prepareIdentifierValue(value)
    }

    this._rawActionTaker.value = normalValue
  }

  static createFromRawInstance (rawInstance: ActionTakerNAPI): ActionTakerWASM {
    const instance: ActionTakerWASM = Object.create(this.prototype)
    instance._rawActionTaker = rawInstance

    return instance
  }
}
