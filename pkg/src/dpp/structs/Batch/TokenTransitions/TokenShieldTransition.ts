import type { TokenShieldTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Moves tokens from the owner balance into the token shielded pool **/
export class TokenShieldTransitionWASM {
  /** @private **/
  _rawTransition: TokenShieldTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    amount: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawTransition = new dppProvider.dpp.TokenShieldTransitionNAPI(
      base._rawTokenBaseTransition,
      amount.toString(),
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

  static createFromRawInstance (rawInstance: TokenShieldTransitionNAPI): TokenShieldTransitionWASM {
    const instance: TokenShieldTransitionWASM = Object.create(TokenShieldTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
