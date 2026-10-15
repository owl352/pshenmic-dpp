import type { TokenDirectPurchaseToPoolTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Buys tokens at their direct purchase price into the token shielded pool **/
export class TokenDirectPurchaseToPoolTransitionWASM {
  /** @private **/
  _rawTransition: TokenDirectPurchaseToPoolTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    tokenCount: bigint,
    totalAgreedPrice: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawTransition = new dppProvider.dpp.TokenDirectPurchaseToPoolTransitionNAPI(
      base._rawTokenBaseTransition,
      tokenCount.toString(),
      totalAgreedPrice.toString(),
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

  get tokenCount (): bigint {
    return BigInt(this._rawTransition.tokenCount)
  }

  set tokenCount (value: bigint) {
    this._rawTransition.tokenCount = value.toString()
  }

  get totalAgreedPrice (): bigint {
    return BigInt(this._rawTransition.totalAgreedPrice)
  }

  set totalAgreedPrice (value: bigint) {
    this._rawTransition.totalAgreedPrice = value.toString()
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

  static createFromRawInstance (rawInstance: TokenDirectPurchaseToPoolTransitionNAPI): TokenDirectPurchaseToPoolTransitionWASM {
    const instance: TokenDirectPurchaseToPoolTransitionWASM = Object.create(TokenDirectPurchaseToPoolTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
