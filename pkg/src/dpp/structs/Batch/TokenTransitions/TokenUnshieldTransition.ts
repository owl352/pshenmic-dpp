import type { TokenUnshieldTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { IdentifierWASM } from '../../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../../dpp/utils.js'
import { IdentifierLike } from '../../../../dpp/types.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Moves tokens from the token shielded pool to an identity balance **/
export class TokenUnshieldTransitionWASM {
  /** @private **/
  _rawTransition: TokenUnshieldTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    amount: bigint,
    recipientId: IdentifierLike,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawTransition = new dppProvider.dpp.TokenUnshieldTransitionNAPI(
      base._rawTokenBaseTransition,
      amount.toString(),
      prepareIdentifierValue(recipientId),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingSignature
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base)
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

  get recipientId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTransition.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawTransition.recipientId = prepareIdentifierValue(value)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawTransition.bindingsSignature = value
  }

  static createFromRawInstance (rawInstance: TokenUnshieldTransitionNAPI): TokenUnshieldTransitionWASM {
    const instance: TokenUnshieldTransitionWASM = Object.create(TokenUnshieldTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
