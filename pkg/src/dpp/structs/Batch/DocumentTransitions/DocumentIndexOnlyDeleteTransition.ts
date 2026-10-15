import type { DocumentIndexOnlyDeleteTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { DocumentTransitionWASM } from '../DocumentTransition.js'

export class DocumentIndexOnlyDeleteTransitionWASM {
  /** @private **/
  _rawDocumentIndexOnlyDeleteTransition: DocumentIndexOnlyDeleteTransitionNAPI

  /** The document properties identify the indexOnly document being deleted **/
  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentIndexOnlyDeleteTransition = new dppProvider.dpp.DocumentIndexOnlyDeleteTransitionNAPI(
      document._rawDocument,
      identityContractNonce?.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get data (): any {
    return valueFromDynamicValue(this._rawDocumentIndexOnlyDeleteTransition.data, true)
  }

  set data (value: object) {
    this._rawDocumentIndexOnlyDeleteTransition.data = valueToDynamicValue(value)
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentIndexOnlyDeleteTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentIndexOnlyDeleteTransition.base = value._rawDocumentBaseTransition
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentIndexOnlyDeleteTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentIndexOnlyDeleteTransitionWASM {
    return DocumentIndexOnlyDeleteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentIndexOnlyDeleteTransitionNAPI.fromDocumentTransition(transition._rawTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentIndexOnlyDeleteTransitionNAPI): DocumentIndexOnlyDeleteTransitionWASM {
    const instance: DocumentIndexOnlyDeleteTransitionWASM = Object.create(DocumentIndexOnlyDeleteTransitionWASM.prototype)
    instance._rawDocumentIndexOnlyDeleteTransition = rawInstance

    return instance
  }
}
