import { DocumentTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
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
  _rawDocumentTransition: DocumentTransitionNAPI

  constructor (transition: DocumentTransitionLike) {
    this._rawDocumentTransition = transition.toDocumentTransition()._rawDocumentTransition
  }

  get actionType (): string {
    return this._rawDocumentTransition.actionType
  }

  get actionTypeNumber (): number {
    return this._rawDocumentTransition.actionTypeNumber
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocumentTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawDocumentTransition.dataContractId = prepareIdentifierValue(value)
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocumentTransition.id)
  }

  get documentTypeName (): string {
    return this._rawDocumentTransition.documentTypeName
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawDocumentTransition.identityContractNonce)
  }

  set identityContractNonce (value: bigint) {
    this._rawDocumentTransition.identityContractNonce = value.toString()
  }

  get revision (): bigint | undefined {
    const rev = this._rawDocumentTransition.revision

    if (rev != null) {
      return BigInt(rev)
    }
  }

  set revision (value: bigint) {
    this._rawDocumentTransition.revision = value.toString()
  }

  get entropy (): Uint8Array | undefined {
    return this._rawDocumentTransition.entropy ?? undefined
  }

  get createTransition (): DocumentCreateTransitionWASM {
    return DocumentCreateTransitionWASM.createFromRawInstance(this._rawDocumentTransition.createTransition)
  }

  get deleteTransition (): DocumentDeleteTransitionWASM {
    return DocumentDeleteTransitionWASM.createFromRawInstance(this._rawDocumentTransition.deleteTransition)
  }

  get purchaseTransition (): DocumentPurchaseTransitionWASM {
    return DocumentPurchaseTransitionWASM.createFromRawInstance(this._rawDocumentTransition.purchaseTransition)
  }

  get replaceTransition (): DocumentReplaceTransitionWASM {
    return DocumentReplaceTransitionWASM.createFromRawInstance(this._rawDocumentTransition.replaceTransition)
  }

  get transferTransition (): DocumentTransferTransitionWASM {
    return DocumentTransferTransitionWASM.createFromRawInstance(this._rawDocumentTransition.transferTransition)
  }

  get updatePriceTransition (): DocumentUpdatePriceTransitionWASM {
    return DocumentUpdatePriceTransitionWASM.createFromRawInstance(this._rawDocumentTransition.updatePriceTransition)
  }

  static createFromRawInstance (rawInstance: DocumentTransitionNAPI): DocumentTransitionWASM {
    const instance: DocumentTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentTransition = rawInstance

    return instance
  }
}
