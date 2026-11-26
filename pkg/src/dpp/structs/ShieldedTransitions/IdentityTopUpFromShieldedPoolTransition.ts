import type { IdentityTopUpFromShieldedPoolTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Tops up an identity with credits spent from the shielded pool **/
export class IdentityTopUpFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawIdentityTopUpFromShieldedPoolTransition: IdentityTopUpFromShieldedPoolTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    actions: SerializedActionWASM[],
    topUpAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawIdentityTopUpFromShieldedPoolTransition = new dppProvider.dpp.IdentityTopUpFromShieldedPoolTransitionNAPI(
      prepareIdentifierValue(identityId),
      actions.map(a => a._rawSerializedAction),
      topUpAmount.toString(),
      anchor,
      proof,
      bindingSignature
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawIdentityTopUpFromShieldedPoolTransition.identityId = prepareIdentifierValue(value)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawIdentityTopUpFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawIdentityTopUpFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get topUpAmount (): bigint {
    return BigInt(this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount)
  }

  set topUpAmount (value: bigint) {
    this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityTopUpFromShieldedPoolTransitionWASM {
    return IdentityTopUpFromShieldedPoolTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityTopUpFromShieldedPoolTransitionNAPI): IdentityTopUpFromShieldedPoolTransitionWASM {
    const instance: IdentityTopUpFromShieldedPoolTransitionWASM = Object.create(IdentityTopUpFromShieldedPoolTransitionWASM.prototype)
    instance._rawIdentityTopUpFromShieldedPoolTransition = rawInstance

    return instance
  }
}
