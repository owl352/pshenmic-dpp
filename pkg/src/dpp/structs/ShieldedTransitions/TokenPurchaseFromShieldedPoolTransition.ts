import type { TokenPurchaseFromShieldedPoolTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Buys tokens at their direct purchase price with credits from the shielded pool **/
export class TokenPurchaseFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawTokenPurchaseFromShieldedPoolTransition: TokenPurchaseFromShieldedPoolTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
    tokenCount: bigint,
    totalAgreedPrice: bigint,
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
    this._rawTokenPurchaseFromShieldedPoolTransition = new dppProvider.dpp.TokenPurchaseFromShieldedPoolTransitionNAPI(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
      tokenCount.toString(),
      totalAgreedPrice.toString(),
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
    return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenId = prepareIdentifierValue(value)
  }

  get tokenCount (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount)
  }

  set tokenCount (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount = value.toString()
  }

  get totalAgreedPrice (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice)
  }

  set totalAgreedPrice (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice = value.toString()
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenPurchaseFromShieldedPoolTransitionWASM {
    return TokenPurchaseFromShieldedPoolTransitionWASM.createFromRawInstance(
      dppProvider.dpp.TokenPurchaseFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenPurchaseFromShieldedPoolTransitionNAPI): TokenPurchaseFromShieldedPoolTransitionWASM {
    const instance: TokenPurchaseFromShieldedPoolTransitionWASM = Object.create(TokenPurchaseFromShieldedPoolTransitionWASM.prototype)
    instance._rawTokenPurchaseFromShieldedPoolTransition = rawInstance

    return instance
  }
}
