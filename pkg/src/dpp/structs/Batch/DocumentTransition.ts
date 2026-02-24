import type { DocumentTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { DocumentCreateTransitionWASM } from './DocumentTransitions/DocumentCreateTransition.js'
import { DocumentReplaceTransitionWASM } from './DocumentTransitions/DocumentReplaceTransition.js'
import { DocumentDeleteTransitionWASM } from './DocumentTransitions/DocumentDeleteTransition.js'
import { DocumentPurchaseTransitionWASM } from './DocumentTransitions/DocumentPurchaseTransition.js'
import { DocumentTransferTransitionWASM } from './DocumentTransitions/DocumentTransferTransition.js'
import { DocumentUpdatePriceTransitionWASM } from './DocumentTransitions/DocumentUpdatePriceTransition.js'
import { DocumentTransitionLike, IdentifierLike } from '../../types.js'
import { IdentifierWASM } from '../Identifier.js'
import { prepareIdentifierValue } from '../../utils.js'

export class DocumentTransitionWASM {
  /** @private **/
  _rawTransition: DocumentTransitionNAPI

  constructor (transition: DocumentTransitionLike) {
    this._rawTransition = transition.toDocumentTransition()._rawTransition
  }

  get actionType (): string {
    return this._rawTransition.actionType
  }

  get actionTypeNumber (): number {
    return this._rawTransition.actionTypeNumber
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTransition.dataContractId = prepareIdentifierValue(value)
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.id)
  }

  get documentTypeName (): string {
    return this._rawTransition.documentTypeName
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawTransition.identityContractNonce)
  }

  set identityContractNonce (value: bigint) {
    this._rawTransition.identityContractNonce = value.toString()
  }

  get revision (): bigint | undefined {
    const rev = this._rawTransition.revision

    if (rev != null) {
      return BigInt(rev)
    }
  }

  set revision (value: bigint) {
    this._rawTransition.revision = value.toString()
  }

  get entropy (): Uint8Array | undefined {
    return this._rawTransition.entropy ?? undefined
  }

  get createTransition (): DocumentCreateTransitionWASM {
    return DocumentCreateTransitionWASM.createFromRawInstance(this._rawTransition.createTransition)
  }

  get deleteTransition (): DocumentDeleteTransitionWASM {
    return DocumentDeleteTransitionWASM.createFromRawInstance(this._rawTransition.deleteTransition)
  }

  get purchaseTransition (): DocumentPurchaseTransitionWASM {
    return DocumentPurchaseTransitionWASM.createFromRawInstance(this._rawTransition.purchaseTransition)
  }

  get replaceTransition (): DocumentReplaceTransitionWASM {
    return DocumentReplaceTransitionWASM.createFromRawInstance(this._rawTransition.replaceTransition)
  }

  get transferTransition (): DocumentTransferTransitionWASM {
    return DocumentTransferTransitionWASM.createFromRawInstance(this._rawTransition.transferTransition)
  }

  get updatePriceTransition (): DocumentUpdatePriceTransitionWASM {
    return DocumentUpdatePriceTransitionWASM.createFromRawInstance(this._rawTransition.updatePriceTransition)
  }

  idDocumentTransition(): boolean {
    return true
  }

  static createFromRawInstance (rawInstance: DocumentTransitionNAPI): DocumentTransitionWASM {
    const instance: DocumentTransitionWASM = Object.create(DocumentTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
