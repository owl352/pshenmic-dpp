import type { BatchTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { BatchedTransitionWASM } from './BatchedTransition.js'
import { prepareIdentifierValue } from '../../utils.js'
import { DocumentTransitionWASM } from './DocumentTransition.js'
import { IdentifierWASM } from '../Identifier.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class BatchTransitionWASM {
  /** @private **/
  _rawBatchTransition: BatchTransitionNAPI

  constructor (
    transitions: BatchedTransitionWASM[],
    ownerId: IdentifierLike,
    userFeeIncrease?: number,
    signaturePublicKeyId?: number,
    signature?: Uint8Array
  )

  constructor (
    transitions: DocumentTransitionWASM[],
    ownerId: IdentifierLike,
    userFeeIncrease?: number,
    signaturePublicKeyId?: number,
    signature?: Uint8Array
  )

  constructor (
    transitions: BatchedTransitionWASM[] | DocumentTransitionWASM[],
    ownerId: IdentifierLike,
    userFeeIncrease?: number,
    signaturePublicKeyId?: number,
    signature?: Uint8Array
  ) {
    if (transitions.length === 0) {
      throw new Error('transitions array must not be empty')
    }

    const [transition] = transitions

    if (transition instanceof BatchedTransitionWASM) {
      this._rawBatchTransition = dppProvider.dpp.BatchTransitionNAPI.fromV1BatchedTransitions(
        (transitions as BatchedTransitionWASM[]).map(t => t._rawTransition),
        prepareIdentifierValue(ownerId),
        userFeeIncrease,
        signaturePublicKeyId,
        signature
      )
    } else {
      this._rawBatchTransition = dppProvider.dpp.BatchTransitionNAPI.fromV0Transitions(
        (transitions as DocumentTransitionWASM[]).map(t => t._rawTransition),
        prepareIdentifierValue(ownerId),
        userFeeIncrease,
        signaturePublicKeyId,
        signature
      )
    }
  }

  get transitions (): BatchedTransitionWASM[] {
    return this._rawBatchTransition.transitions.map(BatchedTransitionWASM.createFromRawInstance)
  }

  set transitions (value: BatchedTransitionWASM[]) {
    this._rawBatchTransition.transitions = value.map(t => t._rawTransition)
  }

  get signature (): Uint8Array {
    return this._rawBatchTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawBatchTransition.signature = value
  }

  get signaturePublicKeyId (): number {
    return this._rawBatchTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawBatchTransition.signaturePublicKeyId = value
  }

  get allPurchasesAmount (): bigint | undefined {
    const amount = this._rawBatchTransition.allPurchasesAmount

    if (amount != null) {
      return BigInt(amount)
    }
  }

  get ownerId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawBatchTransition.ownerId)
  }

  get modifiedDataIds (): IdentifierWASM[] {
    return this._rawBatchTransition.modifiedDataIds.map(IdentifierWASM.createFromRawInstance)
  }

  get allConflictingIndexCollateralVotingFunds (): bigint | undefined {
    const funds = this._rawBatchTransition.allConflictingIndexCollateralVotingFunds

    if (funds != null) {
      return BigInt(funds)
    }
  }

  setIdentityContractNonce (nonce: bigint): void {
    this._rawBatchTransition.setIdentityContractNonce(nonce.toString())
  }

  bytes (): Uint8Array {
    return this._rawBatchTransition.bytes()
  }

  hex (): string {
    return this._rawBatchTransition.hex()
  }

  base64 (): string {
    return this._rawBatchTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawBatchTransition.toStateTransition()
    )
  }

  static fromV1BatchedTransitions (
    batchedTransitions: BatchedTransitionWASM[],
    ownerId: IdentifierLike,
    userFeeIncrease?: number,
    signaturePublicKeyId?: number,
    signature?: Uint8Array
  ): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromV1BatchedTransitions(
        batchedTransitions.map(t => t._rawTransition),
        prepareIdentifierValue(ownerId),
        userFeeIncrease,
        signaturePublicKeyId,
        signature
      )
    )
  }

  static fromV0Transitions (
    documentTransitions: DocumentTransitionWASM[],
    ownerId: IdentifierLike,
    userFeeIncrease?: number,
    signaturePublicKeyId?: number,
    signature?: Uint8Array
  ): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromV0Transitions(
        documentTransitions.map(t => t._rawTransition),
        prepareIdentifierValue(ownerId),
        userFeeIncrease,
        signaturePublicKeyId,
        signature
      )
    )
  }

  static fromBytes (bytes: Uint8Array): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromBase64 (base64: string): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromBase64(base64)
    )
  }

  static fromHex (hex: string): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromHex(hex)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): BatchTransitionWASM {
    return BatchTransitionWASM.createFromRawInstance(
      dppProvider.dpp.BatchTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: BatchTransitionNAPI): BatchTransitionWASM {
    const instance: BatchTransitionWASM = Object.create(BatchTransitionWASM.prototype)
    instance._rawBatchTransition = rawInstance

    return instance
  }
}
