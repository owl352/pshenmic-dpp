import type { BatchedTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { TokenTransitionWASM } from './TokenTransition.js'
import { DocumentTransitionWASM } from './DocumentTransition.js'
import { dppProvider } from '../../provider.js'
import { IdentifierWASM } from '../Identifier.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierLike } from '../../types.js'

export class BatchedTransitionWASM {
  /** @private **/
  _rawTransition: BatchedTransitionNAPI

  constructor (transition: TokenTransitionWASM | DocumentTransitionWASM) {
    let raw: BatchedTransitionNAPI

    if (transition instanceof DocumentTransitionWASM) {
      raw = new dppProvider.dpp.BatchedTransitionNAPI(
        transition._rawTransition
      )
    } else {
      raw = new dppProvider.dpp.BatchedTransitionNAPI(
        transition._rawTokenTransition
      )
    }

    this._rawTransition = raw
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTransition.dataContractId = prepareIdentifierValue(value)
  }

  toTransition (): DocumentTransitionWASM | TokenTransitionWASM {
    const raw = this._rawTransition.toTransition()

    if (raw instanceof dppProvider.dpp.DocumentTransitionNAPI) {
      return DocumentTransitionWASM.createFromRawInstance(raw)
    } else {
      return TokenTransitionWASM.createFromRawInstance(raw)
    }
  }

  static createFromRawInstance (rawInstance: BatchedTransitionNAPI): BatchedTransitionWASM {
    const instance: BatchedTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
