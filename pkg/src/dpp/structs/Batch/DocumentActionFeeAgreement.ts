import type { AgreedFeeMultiplierNAPI, DocumentActionFeeAgreementNAPI } from '../../../../binaries/bindingsTypes.js'
import { BatchTypeLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../DataContract.js'

/** The epoch fee multiplier a document transition agrees to pay its action fee at, and how much it may grow before execution **/
export class AgreedFeeMultiplierWASM {
  /** @private **/
  _rawAgreedFeeMultiplier: AgreedFeeMultiplierNAPI

  constructor (knownPermille: bigint, increaseTolerancePercent: number) {
    this._rawAgreedFeeMultiplier = new dppProvider.dpp.AgreedFeeMultiplierNAPI(
      knownPermille.toString(),
      increaseTolerancePercent
    )
  }

  get knownPermille (): bigint {
    return BigInt(this._rawAgreedFeeMultiplier.knownPermille)
  }

  set knownPermille (value: bigint) {
    this._rawAgreedFeeMultiplier.knownPermille = value.toString()
  }

  get increaseTolerancePercent (): number {
    return this._rawAgreedFeeMultiplier.increaseTolerancePercent
  }

  set increaseTolerancePercent (value: number) {
    this._rawAgreedFeeMultiplier.increaseTolerancePercent = value
  }

  /** Whether the current epoch fee multiplier (permille) is within the agreed tolerance **/
  tolerates (currentPermille: bigint): boolean {
    return this._rawAgreedFeeMultiplier.tolerates(currentPermille.toString())
  }

  static createFromRawInstance (rawInstance: AgreedFeeMultiplierNAPI): AgreedFeeMultiplierWASM {
    const instance: AgreedFeeMultiplierWASM = Object.create(AgreedFeeMultiplierWASM.prototype)
    instance._rawAgreedFeeMultiplier = rawInstance

    return instance
  }
}

/** The action fee a document transition agrees to pay to the contract fee pots (protocol version 14) **/
export class DocumentActionFeeAgreementWASM {
  /** @private **/
  _rawDocumentActionFeeAgreement: DocumentActionFeeAgreementNAPI

  /** A fee multiplier makes the agreement priced by the epoch fee multiplier, none makes it fixed **/
  constructor (owner: bigint, moderators: bigint, feeMultiplier?: AgreedFeeMultiplierWASM) {
    this._rawDocumentActionFeeAgreement = new dppProvider.dpp.DocumentActionFeeAgreementNAPI(
      owner.toString(),
      moderators.toString(),
      feeMultiplier?._rawAgreedFeeMultiplier
    )
  }

  /** The agreement to the fee the document type declares for the action, or undefined when the action charges no fee **/
  static forDocumentTypeAction (
    dataContract: DataContractWASM,
    documentTypeName: string,
    action: BatchTypeLike,
    feeMultiplier: AgreedFeeMultiplierWASM
  ): DocumentActionFeeAgreementWASM | undefined {
    const raw = dppProvider.dpp.DocumentActionFeeAgreementNAPI.forDocumentTypeAction(
      dataContract._rawDataContract,
      documentTypeName,
      valueToDynamicValue(action),
      feeMultiplier._rawAgreedFeeMultiplier
    )

    return raw != null ? DocumentActionFeeAgreementWASM.createFromRawInstance(raw) : undefined
  }

  get owner (): bigint {
    return BigInt(this._rawDocumentActionFeeAgreement.owner)
  }

  set owner (value: bigint) {
    this._rawDocumentActionFeeAgreement.owner = value.toString()
  }

  get moderators (): bigint {
    return BigInt(this._rawDocumentActionFeeAgreement.moderators)
  }

  set moderators (value: bigint) {
    this._rawDocumentActionFeeAgreement.moderators = value.toString()
  }

  get feeMultiplier (): AgreedFeeMultiplierWASM | undefined {
    const multiplier = this._rawDocumentActionFeeAgreement.feeMultiplier

    return multiplier != null ? AgreedFeeMultiplierWASM.createFromRawInstance(multiplier) : undefined
  }

  set feeMultiplier (value: AgreedFeeMultiplierWASM | undefined | null) {
    this._rawDocumentActionFeeAgreement.feeMultiplier = value?._rawAgreedFeeMultiplier
  }

  get pricing (): 'feeMultiplier' | 'fixed' {
    return this._rawDocumentActionFeeAgreement.pricing as 'feeMultiplier' | 'fixed'
  }

  /**
   * Checks the agreement the way the network does before executing the transition: it must match the fee
   * the document type declares for the action, and, when priced by the fee multiplier, tolerate the current
   * epoch fee multiplier (from verifyEpochsInfoProof). An action that charges no fee always passes.
   * Agreements to an elected moderators discount are not covered.
   **/
  verify (
    dataContract: DataContractWASM,
    documentTypeName: string,
    action: BatchTypeLike,
    currentFeeMultiplierPermille?: bigint
  ): boolean {
    return this._rawDocumentActionFeeAgreement.verify(
      dataContract._rawDataContract,
      documentTypeName,
      valueToDynamicValue(action),
      currentFeeMultiplierPermille?.toString()
    )
  }

  static createFromRawInstance (rawInstance: DocumentActionFeeAgreementNAPI): DocumentActionFeeAgreementWASM {
    const instance: DocumentActionFeeAgreementWASM = Object.create(DocumentActionFeeAgreementWASM.prototype)
    instance._rawDocumentActionFeeAgreement = rawInstance

    return instance
  }
}
