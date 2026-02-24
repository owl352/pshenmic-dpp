import type { DocumentUpdatePriceTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { DocumentTransitionWASM } from '../DocumentTransition.js'

export class DocumentUpdatePriceTransitionWASM {
  /** @private **/
  _rawDocumentUpdatePriceTransition: DocumentUpdatePriceTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    price: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentUpdatePriceTransition = new dppProvider.dpp.DocumentUpdatePriceTransitionNAPI(
      document._rawDocument,
      identityContractNonce.toString(),
      price.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentUpdatePriceTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentUpdatePriceTransition.base = value._rawDocumentBaseTransition
  }

  get price (): bigint {
    return BigInt(this._rawDocumentUpdatePriceTransition.price)
  }

  set price (value: bigint) {
    this._rawDocumentUpdatePriceTransition.price = value.toString()
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentUpdatePriceTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentUpdatePriceTransitionWASM {
    return DocumentUpdatePriceTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentUpdatePriceTransitionNAPI.fromDocumentTransition(transition._rawTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentUpdatePriceTransitionNAPI): DocumentUpdatePriceTransitionWASM {
    const instance: DocumentUpdatePriceTransitionWASM = Object.create(DocumentUpdatePriceTransitionWASM.prototype)
    instance._rawDocumentUpdatePriceTransition = rawInstance

    return instance
  }
}
