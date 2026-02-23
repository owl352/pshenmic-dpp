import type { DocumentReplaceTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { DocumentTransitionWASM } from '../DocumentTransition.js'

export class DocumentReplaceTransitionWASM {
  /** @private **/
  _rawDocumentReplaceTransition: DocumentReplaceTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentReplaceTransition = new dppProvider.dpp.DocumentReplaceTransitionNAPI(
      document._rawDocument,
      identityContractNonce.toString(),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get data (): object {
    return valueFromDynamicValue(this._rawDocumentReplaceTransition.data)
  }

  set data (value: object) {
    this._rawDocumentReplaceTransition.data = valueToDynamicValue(value)
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentReplaceTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentReplaceTransition.base = value._rawDocumentBaseTransition
  }

  get revision (): bigint {
    return BigInt(this._rawDocumentReplaceTransition.revision)
  }

  set revision (value: bigint) {
    this._rawDocumentReplaceTransition.revision = value.toString()
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentReplaceTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentReplaceTransitionWASM {
    return DocumentReplaceTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentReplaceTransitionNAPI.fromDocumentTransition(transition._rawTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentReplaceTransitionNAPI): DocumentReplaceTransitionWASM {
    const instance: DocumentReplaceTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentReplaceTransition = rawInstance

    return instance
  }
}
