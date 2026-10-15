import type { IdentityKeyLimitsUpdateTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Changes the budget and expiry of an identity key (platform v14+). `None` removes a limit **/
export class IdentityKeyLimitsUpdateTransitionWASM {
  /** @private **/
  _rawIdentityKeyLimitsUpdateTransition: IdentityKeyLimitsUpdateTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    nonce: bigint,
    keyId: number,
    totalBudget: bigint | undefined,
    expiresAt: bigint | undefined,
    userFeeIncrease?: number
  ) {
    this._rawIdentityKeyLimitsUpdateTransition = new dppProvider.dpp.IdentityKeyLimitsUpdateTransitionNAPI(
      prepareIdentifierValue(identityId),
      nonce.toString(),
      keyId,
      totalBudget?.toString(),
      expiresAt?.toString(),
      userFeeIncrease
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityKeyLimitsUpdateTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawIdentityKeyLimitsUpdateTransition.identityId = prepareIdentifierValue(value)
  }

  get nonce (): bigint {
    return BigInt(this._rawIdentityKeyLimitsUpdateTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawIdentityKeyLimitsUpdateTransition.nonce = value.toString()
  }

  get keyId (): number {
    return this._rawIdentityKeyLimitsUpdateTransition.keyId
  }

  set keyId (value: number) {
    this._rawIdentityKeyLimitsUpdateTransition.keyId = value
  }

  get totalBudget (): bigint | undefined {
    const value = this._rawIdentityKeyLimitsUpdateTransition.totalBudget

    return value != null ? BigInt(value) : undefined
  }

  set totalBudget (value: bigint | undefined) {
    this._rawIdentityKeyLimitsUpdateTransition.totalBudget = value?.toString()
  }

  get expiresAt (): bigint | undefined {
    const value = this._rawIdentityKeyLimitsUpdateTransition.expiresAt

    return value != null ? BigInt(value) : undefined
  }

  set expiresAt (value: bigint | undefined) {
    this._rawIdentityKeyLimitsUpdateTransition.expiresAt = value?.toString()
  }

  get userFeeIncrease (): number {
    return this._rawIdentityKeyLimitsUpdateTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityKeyLimitsUpdateTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawIdentityKeyLimitsUpdateTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawIdentityKeyLimitsUpdateTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawIdentityKeyLimitsUpdateTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityKeyLimitsUpdateTransition.signature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawIdentityKeyLimitsUpdateTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityKeyLimitsUpdateTransitionWASM {
    return IdentityKeyLimitsUpdateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityKeyLimitsUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityKeyLimitsUpdateTransitionNAPI): IdentityKeyLimitsUpdateTransitionWASM {
    const instance: IdentityKeyLimitsUpdateTransitionWASM = Object.create(IdentityKeyLimitsUpdateTransitionWASM.prototype)
    instance._rawIdentityKeyLimitsUpdateTransition = rawInstance

    return instance
  }
}
