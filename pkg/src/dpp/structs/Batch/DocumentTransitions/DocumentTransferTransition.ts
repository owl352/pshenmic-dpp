import { DocumentTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { IdentifierLike } from '../../../types.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { IdentifierWASM } from '../../Identifier.js'

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

  // TODO:
  // toDocumentTransition
  // fromDocumentTransition

  static createFromRawInstance (rawInstance: DocumentTransferTransitionNAPI): DocumentTransferTransitionWASM {
    const instance: DocumentTransferTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentTransferTransition = rawInstance

    return instance
  }
}
