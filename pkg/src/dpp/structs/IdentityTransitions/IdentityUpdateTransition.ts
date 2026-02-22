import { IdentityUpdateTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityUpdateTransitionWASM {
  /** @private **/
  _rawIdentityUpdateTransition: IdentityUpdateTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    revision: bigint,
    nonce: bigint,
    addPublicKeys: IdentityPublicKeyInCreationWASM[],
    disablePublicKeys: number[],
    userFeeIncrease?: number) {
    this._rawIdentityUpdateTransition = new dppProvider.dpp.IdentityUpdateTransitionNAPI(
      prepareIdentifierValue(identityId),
      revision.toString(),
      nonce.toString(),
      addPublicKeys.map(key => key._rawKeyInCreation),
      disablePublicKeys,
      userFeeIncrease
    )
  }

  get revision (): bigint {
    return BigInt(this._rawIdentityUpdateTransition.revision)
  }

  set revision (value: bigint) {
    this._rawIdentityUpdateTransition.revision = value.toString()
  }

  get nonce (): bigint {
    return BigInt(this._rawIdentityUpdateTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawIdentityUpdateTransition.nonce = value.toString()
  }

  get identityIdentifier (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityUpdateTransition.identityIdentifier)
  }

  set identityIdentifier (value: IdentifierWASM) {
    this._rawIdentityUpdateTransition.identityIdentifier = value._rawIdentifier
  }

  get publicKeyIdsToDisable (): number[] {
    return this._rawIdentityUpdateTransition.publicKeyIdsToDisable
  }

  set publicKeyIdsToDisable (value: number[]) {
    this._rawIdentityUpdateTransition.publicKeyIdsToDisable = value
  }

  get publicKeyIdsToAdd (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityUpdateTransition.publicKeyIdsToAdd.map(IdentityPublicKeyInCreationWASM.createFromRawInstance)
  }

  set publicKeyIdsToAdd (value: IdentityPublicKeyInCreationWASM[]) {
    this._rawIdentityUpdateTransition.publicKeyIdsToAdd = value.map(key => key._rawKeyInCreation)
  }

  get userFeeIncrease (): number {
    return this._rawIdentityUpdateTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityUpdateTransition.userFeeIncrease = value
  }

  get signature (): Uint8Array {
    return this._rawIdentityUpdateTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityUpdateTransition.signature = value
  }

  get signaturePublicKeyId (): number {
    return this._rawIdentityUpdateTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawIdentityUpdateTransition.signaturePublicKeyId = value
  }

  getSignableBytes (): Uint8Array {
    return this._rawIdentityUpdateTransition.getSignableBytes()
  }

  getPurposeRequirement (): string[] {
    return this._rawIdentityUpdateTransition.getPurposeRequirement()
  }

  getModifiedDataIds (): IdentifierWASM[] {
    return this._rawIdentityUpdateTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance)
  }

  getOptionalAssetLockProof (): AssetLockProofWASM | undefined {
    const lock = this._rawIdentityUpdateTransition.getOptionalAssetLockProof()

    if (lock != null) {
      return AssetLockProofWASM.createFromRawInstance(lock)
    } else {
      return undefined
    }
  }

  bytes (): Uint8Array {
    return this._rawIdentityUpdateTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityUpdateTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityUpdateTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawIdentityUpdateTransition.toStateTransition())
  }

  static fromBytes (bytes: Uint8Array): IdentityUpdateTransitionWASM {
    return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromBytes(bytes))
  }

  static fromHex (hex: string): IdentityUpdateTransitionWASM {
    return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromHex(hex))
  }

  static fromBase64 (base64: string): IdentityUpdateTransitionWASM {
    return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromBase64(base64))
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityUpdateTransitionWASM {
    return IdentityUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition))
  }

  static createFromRawInstance (rawInstance: IdentityUpdateTransitionNAPI): IdentityUpdateTransitionWASM {
    const instance: IdentityUpdateTransitionWASM = Object.create(this.prototype)
    instance._rawIdentityUpdateTransition = rawInstance

    return instance
  }
}
