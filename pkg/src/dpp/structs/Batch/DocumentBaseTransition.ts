import { DocumentBaseTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { TokenPaymentInfoWASM } from './TokenPaymentInfo.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class DocumentBaseTransitionWASM {
  /** @private **/
  _rawDocumentBaseTransition: DocumentBaseTransitionNAPI

  constructor (
    documentId: IdentifierLike,
    identityContractNonce: bigint,
    documentTypeName: string,
    dataContractId: IdentifierLike,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentBaseTransition = new dppProvider.dpp.DocumentBaseTransitionNAPI(
      prepareIdentifierValue(documentId),
      identityContractNonce?.toString(),
      documentTypeName,
      prepareIdentifierValue(dataContractId),
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocumentBaseTransition.id)
  }

  set id (id: IdentifierWASM) {
    this._rawDocumentBaseTransition.id = id._rawIdentifier
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawDocumentBaseTransition.identityContractNonce)
  }

  set identityContractNonce (identityContractNonce: bigint) {
    this._rawDocumentBaseTransition.identityContractNonce = identityContractNonce?.toString()
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawDocumentBaseTransition.dataContractId)
  }

  set dataContractId (id: IdentifierWASM) {
    this._rawDocumentBaseTransition.dataContractId = id._rawIdentifier
  }

  get documentTypeName (): string {
    return this._rawDocumentBaseTransition.documentTypeName
  }

  set documentTypeName (name: string) {
    this._rawDocumentBaseTransition.documentTypeName = name
  }

  get tokenPaymentInfo (): TokenPaymentInfoWASM | undefined {
    const info = this._rawDocumentBaseTransition.tokenPaymentInfo

    if (info != null) {
      return TokenPaymentInfoWASM.crateFromRawInstance(info)
    }
  }

  set tokenPaymentInfo (tokenPaymentInfo: TokenPaymentInfoWASM | undefined) {
    if (tokenPaymentInfo != null) {
      this._rawDocumentBaseTransition.tokenPaymentInfo = tokenPaymentInfo._rawTokenPaymentInfo
    } else {
      this._rawDocumentBaseTransition.clearTokenPaymentInfo()
    }
  }

  static createFromRawInstance (rawInstance: DocumentBaseTransitionNAPI): DocumentBaseTransitionWASM {
    const instance: DocumentBaseTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentBaseTransition = rawInstance

    return instance
  }
}
