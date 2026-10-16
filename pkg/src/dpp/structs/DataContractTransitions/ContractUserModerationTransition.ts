import type { ContractUserModerationTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../dpp/provider.js'
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js'
import { plainIdentifiersToBytes, prepareIdentifierValue, valueToDynamicValue, valueFromDynamicValue } from '../../../dpp/utils.js'
import { IdentifierLike, ContractUserModerationAction } from '../../../dpp/types.js'
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js'

/** A moderator action on a contract user or document. The action is a plain object tagged with `$type` **/
export class ContractUserModerationTransitionWASM {
  /** @private **/
  _rawContractUserModerationTransition: ContractUserModerationTransitionNAPI

  constructor (
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    identityContractNonce: bigint,
    action: ContractUserModerationAction,
    userFeeIncrease?: number
  ) {
    this._rawContractUserModerationTransition = new dppProvider.dpp.ContractUserModerationTransitionNAPI(
      prepareIdentifierValue(ownerId),
      prepareIdentifierValue(dataContractId),
      identityContractNonce.toString(),
      valueToDynamicValue(plainIdentifiersToBytes(action)),
      userFeeIncrease
    )
  }

  get ownerId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawContractUserModerationTransition.ownerId)
  }

  set ownerId (value: IdentifierLike) {
    this._rawContractUserModerationTransition.ownerId = prepareIdentifierValue(value)
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawContractUserModerationTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawContractUserModerationTransition.dataContractId = prepareIdentifierValue(value)
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawContractUserModerationTransition.identityContractNonce)
  }

  set identityContractNonce (value: bigint) {
    this._rawContractUserModerationTransition.identityContractNonce = value.toString()
  }

  get action (): ContractUserModerationAction {
    return valueFromDynamicValue(this._rawContractUserModerationTransition.action, true)
  }

  set action (value: ContractUserModerationAction) {
    this._rawContractUserModerationTransition.action = valueToDynamicValue(plainIdentifiersToBytes(value))
  }

  get userFeeIncrease (): number {
    return this._rawContractUserModerationTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawContractUserModerationTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawContractUserModerationTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawContractUserModerationTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawContractUserModerationTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawContractUserModerationTransition.signature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawContractUserModerationTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): ContractUserModerationTransitionWASM {
    return ContractUserModerationTransitionWASM.createFromRawInstance(
      dppProvider.dpp.ContractUserModerationTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ContractUserModerationTransitionNAPI): ContractUserModerationTransitionWASM {
    const instance: ContractUserModerationTransitionWASM = Object.create(ContractUserModerationTransitionWASM.prototype)
    instance._rawContractUserModerationTransition = rawInstance

    return instance
  }
}
