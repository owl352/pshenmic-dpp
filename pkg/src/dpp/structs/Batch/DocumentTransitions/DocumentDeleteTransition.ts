import { DocumentDeleteTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { DocumentBaseTransitionWASM, DocumentTransitionWASM } from '../../../dpp.js'
import { dppProvider } from '../../../provider.js'

export class DocumentDeleteTransitionWASM {
  /** @private **/
  _rawDocumentDeleteTransition: DocumentDeleteTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentDeleteTransition = new dppProvider.dpp.DocumentDeleteTransitionNAPI(
      document._rawDocument,
      identityContractNonce?.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentDeleteTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentDeleteTransition.base = value._rawDocumentBaseTransition
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentDeleteTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentDeleteTransitionWASM {
    return DocumentDeleteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentDeleteTransitionNAPI.fromDocumentTransition(transition._rawDocumentTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentDeleteTransitionNAPI): DocumentDeleteTransitionWASM {
    const instance: DocumentDeleteTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentDeleteTransition = rawInstance

    return instance
  }
}
