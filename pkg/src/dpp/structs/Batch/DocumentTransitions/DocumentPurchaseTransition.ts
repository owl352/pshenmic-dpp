import { DocumentPurchaseTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'

export class DocumentPurchaseTransitionWASM {
  /** @private **/
  _rawDocumentPurchaseTransition: DocumentPurchaseTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    amount: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentPurchaseTransition = new dppProvider.dpp.DocumentPurchaseTransitionNAPI(
      document._rawDocument,
      identityContractNonce.toString(),
      amount.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentPurchaseTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentPurchaseTransition.base = value._rawDocumentBaseTransition
  }

  get price (): bigint {
    return BigInt(this._rawDocumentPurchaseTransition.price)
  }

  set price (value: bigint) {
    this._rawDocumentPurchaseTransition.price = value.toString()
  }

  get revision (): bigint {
    return BigInt(this._rawDocumentPurchaseTransition.revision)
  }

  set revision (value: bigint) {
    this._rawDocumentPurchaseTransition.revision = value.toString()
  }

  // TODO:
  // toDocumentTransition
  // fromDocumentTransition

  static createFromRawInstance (rawInstance: DocumentPurchaseTransitionNAPI): DocumentPurchaseTransitionWASM {
    const instance: DocumentPurchaseTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentPurchaseTransition = rawInstance

    return instance
  }
}
