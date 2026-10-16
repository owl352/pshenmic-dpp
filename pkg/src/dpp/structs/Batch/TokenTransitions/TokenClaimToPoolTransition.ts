import type { TokenClaimToPoolTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../../dpp/provider.js'
import { valueToDynamicValue } from '../../../../dpp/utils.js'
import { TokenDistributionLike } from '../../../../dpp/types.js'
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js'

/** Claims a token distribution into the token shielded pool **/
export class TokenClaimToPoolTransitionWASM {
  /** @private **/
  _rawTransition: TokenClaimToPoolTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    distributionType: TokenDistributionLike,
    claimUpTo: bigint | undefined,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenClaimToPoolTransitionNAPI(
      base._rawTokenBaseTransition,
      valueToDynamicValue(distributionType),
      claimUpTo?.toString(),
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

  get distributionType (): string {
    return this._rawTransition.distributionType
  }

  set distributionType (value: TokenDistributionLike) {
    this._rawTransition.distributionType = valueToDynamicValue(value)
  }

  get claimUpTo (): bigint | undefined {
    const value = this._rawTransition.claimUpTo

    return value != null ? BigInt(value) : undefined
  }

  set claimUpTo (value: bigint | undefined) {
    this._rawTransition.claimUpTo = value?.toString()
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

  static createFromRawInstance (rawInstance: TokenClaimToPoolTransitionNAPI): TokenClaimToPoolTransitionWASM {
    const instance: TokenClaimToPoolTransitionWASM = Object.create(TokenClaimToPoolTransitionWASM.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
