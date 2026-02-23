import type { DocumentTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { IdentifierLike } from '../../../types.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { IdentifierWASM } from '../../Identifier.js'
import { DocumentTransitionWASM } from '../DocumentTransition.js'

export class DocumentTransferTransitionWASM {
  /** @private **/
  _rawDocumentTransferTransition: DocumentTransferTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    recipient: IdentifierLike,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentTransferTransition = new dppProvider.dpp.DocumentTransferTransitionNAPI(
      document._rawDocument,
      identityContractNonce.toString(),
      prepareIdentifierValue(recipient),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentTransferTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentTransferTransition.base = value._rawDocumentBaseTransition
  }

  get recipientId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocumentTransferTransition.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawDocumentTransferTransition.recipientId = prepareIdentifierValue(value)
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentTransferTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentTransferTransitionWASM {
    return DocumentTransferTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentTransferTransitionNAPI.fromDocumentTransition(transition._rawTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentTransferTransitionNAPI): DocumentTransferTransitionWASM {
    const instance: DocumentTransferTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentTransferTransition = rawInstance

    return instance
  }
}
