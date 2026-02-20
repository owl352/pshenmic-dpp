import { DocumentCreateTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { DocumentWASM } from '../../Document.js'
import { PrefundedVotingBalanceWASM } from '../PrefundedVotingBalance.js'
import { TokenPaymentInfoWASM } from '../TokenPaymentInfo.js'
import { dppProvider } from '../../../provider.js'
import { valueFromDynamicValue, valueToDynamicValue } from '../../../utils.js'
import { DocumentBaseTransitionWASM } from '../DocumentBaseTransition.js'
import { DocumentTransitionWASM } from '../DocumentTransition.js'

export class DocumentCreateTransitionWASM {
  /** @private **/
  _rawDocumentCreateTransition: DocumentCreateTransitionNAPI

  constructor (
    document: DocumentWASM,
    identityContractNonce: bigint,
    prefundedVotingBalance?: PrefundedVotingBalanceWASM,
    tokenPaymentInfo?: TokenPaymentInfoWASM
  ) {
    this._rawDocumentCreateTransition = new dppProvider.dpp.DocumentCreateTransitionNAPI(
      document._rawDocument,
      identityContractNonce.toString(),
      prefundedVotingBalance?._rawPrefundedVotingBalance,
      tokenPaymentInfo?._rawTokenPaymentInfo
    )
  }

  get data (): object {
    return valueFromDynamicValue(this._rawDocumentCreateTransition.data)
  }

  set data (value: object) {
    this._rawDocumentCreateTransition.data = valueToDynamicValue(value)
  }

  get base (): DocumentBaseTransitionWASM {
    return DocumentBaseTransitionWASM.createFromRawInstance(this._rawDocumentCreateTransition.base)
  }

  set base (value: DocumentBaseTransitionWASM) {
    this._rawDocumentCreateTransition.base = value._rawDocumentBaseTransition
  }

  get entropy (): Uint8Array {
    return this._rawDocumentCreateTransition.entropy
  }

  set entropy (value: Uint8Array) {
    this._rawDocumentCreateTransition.entropy = value
  }

  get prefundedVotingBalance (): PrefundedVotingBalanceWASM | undefined {
    const balance = this._rawDocumentCreateTransition.prefundedVotingBalance

    if (balance != null) {
      return PrefundedVotingBalanceWASM.createFromRawInstance(balance)
    }
  }

  set prefundedVotingBalance (value: PrefundedVotingBalanceWASM | undefined) {
    if (value != null) {
      this._rawDocumentCreateTransition.prefundedVotingBalance = value._rawPrefundedVotingBalance
    } else {
      this._rawDocumentCreateTransition.clearPrefundedVotingBalance()
    }
  }

  clearPrefundedVotingBalance (): void {
    this._rawDocumentCreateTransition.clearPrefundedVotingBalance()
  }

  toDocumentTransition (): DocumentTransitionWASM {
    return DocumentTransitionWASM.createFromRawInstance(
      this._rawDocumentCreateTransition.toDocumentTransition()
    )
  }

  static fromDocumentTransition (transition: DocumentTransitionWASM): DocumentCreateTransitionWASM {
    return DocumentCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.DocumentCreateTransitionNAPI.fromDocumentTransition(transition._rawDocumentTransition)
    )
  }

  static createFromRawInstance (rawInstance: DocumentCreateTransitionNAPI): DocumentCreateTransitionWASM {
    const instance: DocumentCreateTransitionWASM = Object.create(this.prototype)
    instance._rawDocumentCreateTransition = rawInstance

    return instance
  }
}
