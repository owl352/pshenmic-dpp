import type { VotePollNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class VotePollWASM {
  /** @private **/
  _rawVotePollWASM: VotePollNAPI

  constructor (contractId: IdentifierLike, documentTypeName: string, indexName: string, indexValues: string[]) {
    this._rawVotePollWASM = new dppProvider.dpp.VotePollNAPI(
      prepareIdentifierValue(contractId),
      documentTypeName,
      indexName,
      valueToDynamicValue(indexValues)
    )
  }

  get contractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawVotePollWASM.contractId)
  }

  set contractId (value: IdentifierLike) {
    this._rawVotePollWASM.contractId = prepareIdentifierValue(value)
  }

  get documentTypeName (): string {
    return this._rawVotePollWASM.documentTypeName
  }

  set documentTypeName (value: string) {
    this._rawVotePollWASM.documentTypeName = value
  }

  get indexName (): string {
    return this._rawVotePollWASM.indexName
  }

  set indexName (value: string) {
    this._rawVotePollWASM.indexName = value
  }

  get indexValues (): string[] {
    return this._rawVotePollWASM.indexValues
  }

  set indexValues (values: string[]) {
    this._rawVotePollWASM.indexValues = valueToDynamicValue(values)
  }

  toString (): string {
    return this._rawVotePollWASM.toString()
  }

  static createFromRawInstance (rawInstance: VotePollNAPI): VotePollWASM {
    const instance: VotePollWASM = Object.create(VotePollWASM.prototype)
    instance._rawVotePollWASM = rawInstance

    return instance
  }
}
