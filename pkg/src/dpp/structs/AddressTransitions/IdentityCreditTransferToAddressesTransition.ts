import type { IdentityCreditTransferToAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { OutputAddressWASM } from './entities/OutputAddress.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreditTransferToAddressesTransitionWASM {
  /** @private **/
  _rawIdentityCreditTransferToAddressesTransition: IdentityCreditTransferToAddressesTransitionNAPI

  constructor (identifier: IdentifierLike, recipients: OutputAddressWASM[], nonce: bigint, userFeeIncrease: number) {
    this._rawIdentityCreditTransferToAddressesTransition = new dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI(
      prepareIdentifierValue(identifier),
      recipients.map(r => r._rawOutputAddress),
      nonce.toString(),
      userFeeIncrease
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditTransferToAddressesTransition.identityId)
  }

  set identityId (id: IdentifierLike) {
    this._rawIdentityCreditTransferToAddressesTransition.identityId = prepareIdentifierValue(id)
  }

  get recipientAddresses (): OutputAddressWASM[] {
    return this._rawIdentityCreditTransferToAddressesTransition.recipientAddresses.map(OutputAddressWASM.createFromRawInstance)
  }

  set recipientAddresses (value: OutputAddressWASM[]) {
    this._rawIdentityCreditTransferToAddressesTransition.recipientAddresses = value.map(r => r._rawOutputAddress)
  }

  get nonce (): bigint {
    return BigInt(this._rawIdentityCreditTransferToAddressesTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawIdentityCreditTransferToAddressesTransition.nonce = value.toString()
  }

  get userFeeIncrease (): number {
    return this._rawIdentityCreditTransferToAddressesTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityCreditTransferToAddressesTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawIdentityCreditTransferToAddressesTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawIdentityCreditTransferToAddressesTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawIdentityCreditTransferToAddressesTransition.signature
  }

  set signature (sig: Uint8Array) {
    this._rawIdentityCreditTransferToAddressesTransition.signature = sig
  }

  bytes (): Uint8Array {
    return this._rawIdentityCreditTransferToAddressesTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityCreditTransferToAddressesTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityCreditTransferToAddressesTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreditTransferToAddressesTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityCreditTransferToAddressesTransitionWASM {
    return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityCreditTransferToAddressesTransitionWASM {
    return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityCreditTransferToAddressesTransitionWASM {
    return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityCreditTransferToAddressesTransitionWASM {
    return IdentityCreditTransferToAddressesTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditTransferToAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreditTransferToAddressesTransitionNAPI): IdentityCreditTransferToAddressesTransitionWASM {
    const instance: IdentityCreditTransferToAddressesTransitionWASM = Object.create(this.prototype)
    instance._rawIdentityCreditTransferToAddressesTransition = rawInstance

    return instance
  }
}
