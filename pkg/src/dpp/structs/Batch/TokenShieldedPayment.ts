import type { TokenShieldedPaymentNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js'

/** The spend bundle paying a document's token cost out of the token's shielded pool **/
export class TokenShieldedPaymentWASM {
  /** @private **/
  _rawTokenShieldedPayment: TokenShieldedPaymentNAPI

  constructor (
    amount: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawTokenShieldedPayment = new dppProvider.dpp.TokenShieldedPaymentNAPI(
      amount.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get amount (): bigint {
    return BigInt(this._rawTokenShieldedPayment.amount)
  }

  set amount (value: bigint) {
    this._rawTokenShieldedPayment.amount = value.toString()
  }

  get actions (): SerializedActionWASM[] {
    return this._rawTokenShieldedPayment.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawTokenShieldedPayment.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawTokenShieldedPayment.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawTokenShieldedPayment.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawTokenShieldedPayment.proof
  }

  set proof (value: Uint8Array) {
    this._rawTokenShieldedPayment.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawTokenShieldedPayment.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawTokenShieldedPayment.bindingsSignature = value
  }

  static createFromRawInstance (rawInstance: TokenShieldedPaymentNAPI): TokenShieldedPaymentWASM {
    const instance: TokenShieldedPaymentWASM = Object.create(TokenShieldedPaymentWASM.prototype)
    instance._rawTokenShieldedPayment = rawInstance

    return instance
  }
}
