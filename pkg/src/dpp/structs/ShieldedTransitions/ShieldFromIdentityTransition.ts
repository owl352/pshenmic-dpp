import type { ShieldFromIdentityTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Moves identity credits into the shielded pool **/
export class ShieldFromIdentityTransitionWASM {
  /** @private **/
  _rawShieldFromIdentityTransition: ShieldFromIdentityTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    amount: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array,
    nonce: bigint,
    userFeeIncrease?: number
  ) {
    this._rawShieldFromIdentityTransition = new dppProvider.dpp.ShieldFromIdentityTransitionNAPI(
      prepareIdentifierValue(identityId),
      amount.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingSignature,
      nonce.toString(),
      userFeeIncrease
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawShieldFromIdentityTransition.identityId = prepareIdentifierValue(value)
  }

  get amount (): bigint {
    return BigInt(this._rawShieldFromIdentityTransition.amount)
  }

  set amount (value: bigint) {
    this._rawShieldFromIdentityTransition.amount = value.toString()
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldFromIdentityTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldFromIdentityTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawShieldFromIdentityTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldFromIdentityTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldFromIdentityTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.bindingsSignature = value
  }

  get nonce (): bigint {
    return BigInt(this._rawShieldFromIdentityTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawShieldFromIdentityTransition.nonce = value.toString()
  }

  get userFeeIncrease (): number {
    return this._rawShieldFromIdentityTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawShieldFromIdentityTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawShieldFromIdentityTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawShieldFromIdentityTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawShieldFromIdentityTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.signature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): ShieldFromIdentityTransitionWASM {
    return ShieldFromIdentityTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ShieldFromIdentityTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldFromIdentityTransitionNAPI): ShieldFromIdentityTransitionWASM {
    const instance: ShieldFromIdentityTransitionWASM = Object.create(ShieldFromIdentityTransitionWASM.prototype)
    instance._rawShieldFromIdentityTransition = rawInstance

    return instance
  }
}
