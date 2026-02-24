import type { IdentityCreditTransferNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreditTransferWASM {
  /** @private **/
  _rawIdentityCreditTransfer: IdentityCreditTransferNAPI

  constructor (sender: IdentifierLike, amount: bigint, recipient: IdentifierLike, nonce: bigint, userFeeIncrease?: number) {
    this._rawIdentityCreditTransfer = new dppProvider.dpp.IdentityCreditTransferNAPI(
      prepareIdentifierValue(sender),
      amount.toString(),
      prepareIdentifierValue(recipient),
      nonce.toString(),
      userFeeIncrease
    )
  }

  get recipientId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransfer.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawIdentityCreditTransfer.recipientId = prepareIdentifierValue(value)
  }

  get senderId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransfer.senderId)
  }

  set senderId (value: IdentifierLike) {
    this._rawIdentityCreditTransfer.recipientId = prepareIdentifierValue(value)
  }

  get amount (): bigint {
    return BigInt(this._rawIdentityCreditTransfer.amount)
  }

  set amount (value: bigint) {
    this._rawIdentityCreditTransfer.amount = value.toString()
  }

  get nonce (): bigint {
    return BigInt(this._rawIdentityCreditTransfer.nonce)
  }

  set nonce (value: bigint) {
    this._rawIdentityCreditTransfer.nonce = value.toString()
  }

  get signature (): Uint8Array {
    return this._rawIdentityCreditTransfer.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityCreditTransfer.signature = value
  }

  get signaturePublicKeyId (): number {
    return this._rawIdentityCreditTransfer.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawIdentityCreditTransfer.signaturePublicKeyId = value
  }

  get userFeeIncrease (): number {
    return this._rawIdentityCreditTransfer.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityCreditTransfer.userFeeIncrease = value
  }

  getSignableBytes (): Uint8Array {
    return this._rawIdentityCreditTransfer.getSignableBytes()
  }

  bytes (): Uint8Array {
    return this._rawIdentityCreditTransfer.bytes()
  }

  hex (): string {
    return this._rawIdentityCreditTransfer.hex()
  }

  base64 (): string {
    return this._rawIdentityCreditTransfer.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreditTransfer.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityCreditTransferWASM {
    return IdentityCreditTransferWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityCreditTransferWASM {
    return IdentityCreditTransferWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityCreditTransferWASM {
    return IdentityCreditTransferWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityCreditTransferWASM {
    return IdentityCreditTransferWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreditTransferNAPI): IdentityCreditTransferWASM {
    const instance: IdentityCreditTransferWASM = Object.create(IdentityCreditTransferWASM.prototype)
    instance._rawIdentityCreditTransfer = rawInstance

    return instance
  }
}
