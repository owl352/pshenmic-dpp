import { DynamicValue, GroupNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierLike } from '../../types.js'

export class GroupWASM {
  /** @private **/
  _rawGroup: GroupNAPI

  constructor (
    members: { [key: string]: number },
    requiredPower: number
  ) {
    const keys = Object.keys(members)
    const normalMembers: Array<[DynamicValue, number]> = []

    for (const key of keys) {
      normalMembers.push([valueToDynamicValue(key), members[key]])
    }

    this._rawGroup = new dppProvider.dpp.GroupNAPI(
      normalMembers,
      requiredPower
    )
  }

  get members (): { [key: string]: number } {
    const rawMembers = this._rawGroup.members
    const out: { [key: string]: number } = {}

    for (const [id, power] of rawMembers) {
      out[id.base58()] = power
    }

    return out
  }

  set members (members: { [key: string]: number }) {
    const keys = Object.keys(members)
    const normalMembers: Array<[DynamicValue, number]> = []

    for (const key of keys) {
      normalMembers.push([valueToDynamicValue(key), members[key]])
    }

    this._rawGroup.members = normalMembers
  }

  get requiredPower (): number {
    return this._rawGroup.requiredPower
  }

  set requiredPower (value: number) {
    this._rawGroup.requiredPower = value
  }

  setMemberRequiredPower (member: IdentifierLike, power: number): void {
    this._rawGroup.setMemberRequiredPower(prepareIdentifierValue(member), power)
  }

  static createFromRawInstance (rawInstance: GroupNAPI): GroupWASM {
    const instance: GroupWASM = Object.create(this.prototype)
    instance._rawGroup = rawInstance

    return instance
  }
}
