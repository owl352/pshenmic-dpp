import type { ContractFeeClaimTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../../dpp/utils.js'
import { IdentifierLike, ContractFeePotLike } from '../../../dpp/types.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** Claims the credits a contract fee pot collected **/
export class ContractFeeClaimTransitionWASM {
  /** @private **/
  _rawContractFeeClaimTransition: ContractFeeClaimTransitionNAPI

  constructor (
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    identityContractNonce: bigint,
    pot: ContractFeePotLike,
    userFeeIncrease?: number
  ) {
    this._rawContractFeeClaimTransition = new dppProvider.dpp.ContractFeeClaimTransitionNAPI(
      prepareIdentifierValue(ownerId),
      prepareIdentifierValue(dataContractId),
      identityContractNonce.toString(),
      valueToDynamicValue(pot),
      userFeeIncrease
    )
  }

  get ownerId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawContractFeeClaimTransition.ownerId)
  }

  set ownerId (value: IdentifierLike) {
    this._rawContractFeeClaimTransition.ownerId = prepareIdentifierValue(value)
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawContractFeeClaimTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawContractFeeClaimTransition.dataContractId = prepareIdentifierValue(value)
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawContractFeeClaimTransition.identityContractNonce)
  }

  set identityContractNonce (value: bigint) {
    this._rawContractFeeClaimTransition.identityContractNonce = value.toString()
  }

  get pot (): string {
    return this._rawContractFeeClaimTransition.pot
  }

  set pot (value: ContractFeePotLike) {
    this._rawContractFeeClaimTransition.pot = valueToDynamicValue(value)
  }

  get userFeeIncrease (): number {
    return this._rawContractFeeClaimTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawContractFeeClaimTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawContractFeeClaimTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawContractFeeClaimTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawContractFeeClaimTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawContractFeeClaimTransition.signature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawContractFeeClaimTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): ContractFeeClaimTransitionWASM {
    return ContractFeeClaimTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ContractFeeClaimTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ContractFeeClaimTransitionNAPI): ContractFeeClaimTransitionWASM {
    const instance: ContractFeeClaimTransitionWASM = Object.create(ContractFeeClaimTransitionWASM.prototype)
    instance._rawContractFeeClaimTransition = rawInstance

    return instance
  }
}
