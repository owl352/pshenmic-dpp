import { DocumentUpdatePriceTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'

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

  // TODO:
  // toDocumentTransition
  // fromDocumentTransition

  static createFromRawInstance (rawInstance: DocumentUpdatePriceTransitionNAPI): DocumentUpdatePriceTransitionWASM {
    const instance: DocumentUpdatePriceTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentUpdatePriceTransition = rawInstance

    return instance
  }
}
