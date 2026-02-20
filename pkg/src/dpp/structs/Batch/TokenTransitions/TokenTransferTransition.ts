import { TokenTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { SharedEncryptedNoteWASM } from '../../EncryptedNote/SharedEncryptedNote.js'
import { PrivateEncryptedNoteWASM } from '../../EncryptedNote/PrivateEncryptedNote.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'

export class TokenTransferTransitionWASM {
  /** @private **/
  _rawTokenTransferTransition: TokenTransferTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    recipientId: IdentifierLike,
    amount: bigint,
    publicNote?: string,
    sharedEncryptedNote?: SharedEncryptedNoteWASM,
    privateEncryptedNote?: PrivateEncryptedNoteWASM
  ) {
    this._rawTokenTransferTransition = new dppProvider.dpp.TokenTransferTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(recipientId),
      amount.toString(),
      publicNote,
      sharedEncryptedNote?._rawSharedNote,
      privateEncryptedNote?._rawEncryptedNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenTransferTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenTransferTransition.base = value._rawTokenBaseTransition
  }

  get amount (): bigint {
    return BigInt(this._rawTokenTransferTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTokenTransferTransition.amount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTokenTransferTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenTransferTransition.publicNote = value
  }

  get sharedEncryptedNote (): SharedEncryptedNoteWASM | undefined {
    const note = this._rawTokenTransferTransition.sharedEncryptedNote

    if (note != null) {
      return SharedEncryptedNoteWASM.createFromRawInstance(note)
    }
  }

  set sharedEncryptedNote (value: SharedEncryptedNoteWASM | undefined) {
    this._rawTokenTransferTransition.sharedEncryptedNote = value?._rawSharedNote
  }

  get privateEncryptedNote (): PrivateEncryptedNoteWASM | undefined {
    const note = this._rawTokenTransferTransition.privateEncryptedNote

    if (note != null) {
      return PrivateEncryptedNoteWASM.createFromRawInstance(note)
    }
  }

  set privateEncryptedNote (value: PrivateEncryptedNoteWASM | undefined) {
    this._rawTokenTransferTransition.privateEncryptedNote = value?._rawEncryptedNote
  }

  static createFromRawInstance (rawInstance: TokenTransferTransitionNAPI): TokenTransferTransitionWASM {
    const instance: TokenTransferTransitionWASM = Object.create(this.prototype)
    instance._rawTokenTransferTransition = rawInstance

    return instance
  }
}
