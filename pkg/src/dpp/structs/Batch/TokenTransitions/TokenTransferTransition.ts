import type { TokenTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { SharedEncryptedNoteWASM } from '../../EncryptedNote/SharedEncryptedNote.js'
import { PrivateEncryptedNoteWASM } from '../../EncryptedNote/PrivateEncryptedNote.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import {IdentifierWASM} from "../../Identifier.js";

export class TokenTransferTransitionWASM {
  /** @private **/
  _rawTransition: TokenTransferTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    recipientId: IdentifierLike,
    amount: bigint,
    publicNote?: string,
    sharedEncryptedNote?: SharedEncryptedNoteWASM,
    privateEncryptedNote?: PrivateEncryptedNoteWASM
  ) {
    this._rawTransition = new dppProvider.dpp.TokenTransferTransitionNAPI(
      base._rawTokenBaseTransition,
      prepareIdentifierValue(recipientId),
      amount.toString(),
      publicNote,
      sharedEncryptedNote?._rawSharedNote,
      privateEncryptedNote?._rawEncryptedNote
    )
  }

  get recipientId(): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawTransition.recipientId = prepareIdentifierValue(value)
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTransition.base = value._rawTokenBaseTransition
  }

  get amount (): bigint {
    return BigInt(this._rawTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTransition.amount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  get sharedEncryptedNote (): SharedEncryptedNoteWASM | undefined {
    const note = this._rawTransition.sharedEncryptedNote

    if (note != null) {
      return SharedEncryptedNoteWASM.createFromRawInstance(note)
    }
  }

  set sharedEncryptedNote (value: SharedEncryptedNoteWASM | undefined) {
    this._rawTransition.sharedEncryptedNote = value?._rawSharedNote
  }

  get privateEncryptedNote (): PrivateEncryptedNoteWASM | undefined {
    const note = this._rawTransition.privateEncryptedNote

    if (note != null) {
      return PrivateEncryptedNoteWASM.createFromRawInstance(note)
    }
  }

  set privateEncryptedNote (value: PrivateEncryptedNoteWASM | undefined) {
    this._rawTransition.privateEncryptedNote = value?._rawEncryptedNote
  }

  static createFromRawInstance (rawInstance: TokenTransferTransitionNAPI): TokenTransferTransitionWASM {
    const instance: TokenTransferTransitionWASM = Object.create(TokenTransferTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
