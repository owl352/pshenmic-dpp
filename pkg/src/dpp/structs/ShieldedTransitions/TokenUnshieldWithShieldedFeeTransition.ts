import type { TokenUnshieldWithShieldedFeeTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Unshields tokens to an identity, paying the fee from the credit shielded pool **/
export class TokenUnshieldWithShieldedFeeTransitionWASM {
  /** @private **/
  _rawTokenUnshieldWithShieldedFeeTransition: TokenUnshieldWithShieldedFeeTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
    recipientId: IdentifierLike,
    amount: bigint,
    tokenActions: SerializedActionWASM[],
    tokenAnchor: Uint8Array,
    tokenProof: Uint8Array,
    tokenBindingSignature: Uint8Array,
    feeActions: SerializedActionWASM[],
    feeAnchor: Uint8Array,
    feeProof: Uint8Array,
    feeBindingSignature: Uint8Array,
    creditAmount: bigint
  ) {
    this._rawTokenUnshieldWithShieldedFeeTransition = new dppProvider.dpp.TokenUnshieldWithShieldedFeeTransitionNAPI(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
      prepareIdentifierValue(recipientId),
      amount.toString(),
      tokenActions.map(a => a._rawSerializedAction),
      tokenAnchor,
      tokenProof,
      tokenBindingSignature,
      feeActions.map(a => a._rawSerializedAction),
      feeAnchor,
      feeProof,
      feeBindingSignature,
      creditAmount.toString()
    )
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value)
  }

  get recipientId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.recipientId = prepareIdentifierValue(value)
  }

  get amount (): bigint {
    return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTokenUnshieldWithShieldedFeeTransition.amount = value.toString()
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenUnshieldWithShieldedFeeTransitionWASM {
    return TokenUnshieldWithShieldedFeeTransitionWASM.createFromRawInstance(
      dppProvider.dpp.TokenUnshieldWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenUnshieldWithShieldedFeeTransitionNAPI): TokenUnshieldWithShieldedFeeTransitionWASM {
    const instance: TokenUnshieldWithShieldedFeeTransitionWASM = Object.create(TokenUnshieldWithShieldedFeeTransitionWASM.prototype)
    instance._rawTokenUnshieldWithShieldedFeeTransition = rawInstance

    return instance
  }
}
