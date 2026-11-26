import type { TokenShieldedTransferWithShieldedFeeTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue } from '../../../dpp/utils.js'
import { IdentifierLike } from '../../../dpp/types.js'
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Transfers tokens inside the token shielded pool, paying the fee from the credit shielded pool **/
export class TokenShieldedTransferWithShieldedFeeTransitionWASM {
  /** @private **/
  _rawTokenShieldedTransferWithShieldedFeeTransition: TokenShieldedTransferWithShieldedFeeTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
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
    this._rawTokenShieldedTransferWithShieldedFeeTransition = new dppProvider.dpp.TokenShieldedTransferWithShieldedFeeTransitionNAPI(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
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
    return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value)
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenShieldedTransferWithShieldedFeeTransitionWASM {
    return TokenShieldedTransferWithShieldedFeeTransitionWASM.createFromRawInstance(
      dppProvider.dpp.TokenShieldedTransferWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenShieldedTransferWithShieldedFeeTransitionNAPI): TokenShieldedTransferWithShieldedFeeTransitionWASM {
    const instance: TokenShieldedTransferWithShieldedFeeTransitionWASM = Object.create(TokenShieldedTransferWithShieldedFeeTransitionWASM.prototype)
    instance._rawTokenShieldedTransferWithShieldedFeeTransition = rawInstance

    return instance
  }
}
