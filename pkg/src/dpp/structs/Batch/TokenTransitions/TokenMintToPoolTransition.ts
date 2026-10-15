import type { TokenMintToPoolTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Mints tokens directly into the token shielded pool **/
export class TokenMintToPoolTransitionWASM {
  /** @private **/
  _rawTransition: TokenMintToPoolTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    amount: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenMintToPoolTransitionNAPI(
      base._rawTokenBaseTransition,
      amount.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingSignature,
      publicNote
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

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenMintToPoolTransitionNAPI): TokenMintToPoolTransitionWASM {
    const instance: TokenMintToPoolTransitionWASM = Object.create(TokenMintToPoolTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
