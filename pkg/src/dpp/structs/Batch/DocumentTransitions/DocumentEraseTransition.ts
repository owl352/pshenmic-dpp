import type { DocumentEraseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { DocumentActionFeeAgreementWASM } from '../DocumentActionFeeAgreement.js'
import { DocumentBaseTransitionWASM, DocumentTransitionWASM } from '../../../dpp.js'
import { dppProvider } from '../../../provider.js'

/**
 * Purges the retained revisions of a keep-history document that has already been
 * deleted (protocol version 15).
 */
export class DocumentEraseTransitionWASM {
  /** @private **/
  _rawDocumentEraseTransition: DocumentEraseTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM,
    actionFeeAgreement?: DocumentActionFeeAgreementWASM
  ) {
    this._rawDocumentEraseTransition = new dppProvider.dpp.DocumentEraseTransitionNAPI(
      document._rawDocument,
      identityContractNonce?.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo,
      actionFeeAgreement?._rawDocumentActionFeeAgreement
    )
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentEraseTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentEraseTransition.base = value._rawDocumentBaseTransition
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentEraseTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentEraseTransitionWASM {
    return DocumentEraseTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentEraseTransitionNAPI.fromDocumentTransition(transition._rawTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentEraseTransitionNAPI): DocumentEraseTransitionWASM {
    const instance: DocumentEraseTransitionWASM = Object.create(DocumentEraseTransitionWASM.prototype)
    instance._rawDocumentEraseTransition = rawInstance

    return instance
  }
}
