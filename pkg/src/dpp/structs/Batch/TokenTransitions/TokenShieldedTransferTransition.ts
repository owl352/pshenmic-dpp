import type { TokenShieldedTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Transfers tokens inside the token shielded pool **/
export class TokenShieldedTransferTransitionWASM {
  /** @private **/
  _rawTransition: TokenShieldedTransferTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawTransition = new dppProvider.dpp.TokenShieldedTransferTransitionNAPI(
      base._rawTokenBaseTransition,
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

  static createFromRawInstance (rawInstance: TokenShieldedTransferTransitionNAPI): TokenShieldedTransferTransitionWASM {
    const instance: TokenShieldedTransferTransitionWASM = Object.create(TokenShieldedTransferTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
