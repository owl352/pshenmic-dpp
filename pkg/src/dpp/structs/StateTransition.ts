import type { StateTransitionNAPI } from '../../../binaries/bindingsTypes.js'
import { dppProvider } from '../provider.js'
import { PrivateKeyWASM } from './PrivateKey.js'
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../utils.js'
import { IdentifierLike, KeyTypeLike, PurposeLike } from '../types.js'
import { IdentifierWASM } from './Identifier.js'

export class StateTransitionWASM {
  /** @private **/
  _rawStateTransition: StateTransitionNAPI

  private constructor (_rawStateTransition: StateTransitionNAPI) {
    this._rawStateTransition = _rawStateTransition
  }

  get signature (): Uint8Array | undefined {
    return this._rawStateTransition.signature ?? undefined
  }

  set signature (signature: Uint8Array) {
    this._rawStateTransition.signature = signature
  }

  get signaturePublicKeyId (): number | undefined {
    return this._rawStateTransition.signaturePublicKeyId ?? undefined
  }

  set signaturePublicKeyId (keyId: number) {
    this._rawStateTransition.signaturePublicKeyId = keyId
  }

  get userFeeIncrease (): number {
    return this._rawStateTransition.userFeeIncrease
  }

  set userFeeIncrease (userFeeIncrease: number) {
    this._rawStateTransition.userFeeIncrease = userFeeIncrease
  }

  sign (privateKey: PrivateKeyWASM | string | Uint8Array, publicKey: IdentityPublicKeyWASM): Uint8Array {
    const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey)

    return this._rawStateTransition.sign(normalPrivateKey, publicKey._rawIdentityPublicKey)
  }

  signByPrivateKey (privateKey: PrivateKeyWASM | string | Uint8Array, keyId?: number, keyType?: KeyTypeLike): Uint8Array {
    const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey)

    return this._rawStateTransition.signByPrivateKey(
      normalPrivateKey,
      keyId,
      keyType ? valueToDynamicValue(keyType) : undefined
    )
  }

  verifyPublicKey (publicKey: IdentityPublicKeyWASM, allowSigningWithAnySecurityLevel?: boolean, allowSigningWithAnyPurpose?: boolean): void {
    this._rawStateTransition.verifyPublicKey(publicKey._rawIdentityPublicKey, allowSigningWithAnySecurityLevel, allowSigningWithAnyPurpose)
  }

  hash (skipSignature: boolean): string {
    return this._rawStateTransition.hash(skipSignature)
  }

  getActionName (): string {
    return this._rawStateTransition.getActionName()
  }

  getActionType (): string {
    return this._rawStateTransition.getActionType()
  }

  getActionTypeNumber (): number {
    return this._rawStateTransition.getActionTypeNumber()
  }

  getOwnerId (): IdentifierWASM | undefined {
    const id = this._rawStateTransition.getOwnerId()

    return (id != null) ? IdentifierWASM.createFromRawInstance(id) : undefined
  }

  getPurposeRequirement (): string[] | undefined {
    return this._rawStateTransition.getPurposeRequirement() ?? undefined
  }

  getKeyLevelRequirement (purpose: PurposeLike): string[] | undefined {
    return this._rawStateTransition.getKeyLevelRequirement(valueToDynamicValue(purpose)) ?? undefined
  }

  getIdentityContractNonce (): bigint | undefined {
    const nonce = this._rawStateTransition.getIdentityContractNonce()

    return nonce != null ? BigInt(nonce) : undefined
  }

  getIdentityNonce (): bigint | undefined {
    const nonce = this._rawStateTransition.getIdentityNonce()

    return nonce != null ? BigInt(nonce) : undefined
  }

  setOwnerId (ownerId: IdentifierLike): void {
    this._rawStateTransition.setOwnerId(prepareIdentifierValue(ownerId))
  }

  setIdentityContractNonce (nonce: bigint): void {
    this._rawStateTransition.setIdentityContractNonce(nonce.toString())
  }

  setIdentityNonce (nonce: bigint): void {
    this._rawStateTransition.setIdentityNonce(nonce.toString())
  }

  bytes (): Uint8Array {
    return this._rawStateTransition.bytes()
  }

  hex (): string {
    return this._rawStateTransition.hex()
  }

  base64 (): string {
    return this._rawStateTransition.base64()
  }

  static fromBytes (bytes: Uint8Array): StateTransitionWASM {
    return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromBytes(bytes))
  }

  static fromHex (hex: string): StateTransitionWASM {
    return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromHex(hex))
  }

  static fromBase64 (base64: string): StateTransitionWASM {
    return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromBase64(base64))
  }

  static createFromRawInstance (instance: StateTransitionNAPI): StateTransitionWASM {
    return new StateTransitionWASM(instance)
  }
}
