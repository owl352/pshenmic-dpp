import type { IdentityTopUpTransitionNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityTopUpTransitionWASM {
  /** @private **/
  _rawIdentityTopUpTransition: IdentityTopUpTransitionNAPI

  constructor (assetLockProof: AssetLockProofWASM, identityId: IdentifierLike, userFeeIncrease?: number) {
    this._rawIdentityTopUpTransition = new dppProvider.dpp.IdentityTopUpTransitionNAPI(
      assetLockProof._rawAssetLockProof,
      prepareIdentifierValue(identityId),
      userFeeIncrease
    )
  }

  get userFeeIncrease (): number {
    return this._rawIdentityTopUpTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityTopUpTransition.userFeeIncrease = value
  }

  get identityIdentifier (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityTopUpTransition.identityIdentifier)
  }

  set identityIdentifier (id: IdentifierLike) {
    this._rawIdentityTopUpTransition.identityIdentifier = prepareIdentifierValue(id)
  }

  get assetLockProof (): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(this._rawIdentityTopUpTransition.assetLockProof)
  }

  set assetLockProof (value: AssetLockProofWASM) {
    this._rawIdentityTopUpTransition.assetLockProof = value._rawAssetLockProof
  }

  get signature (): Uint8Array {
    return this._rawIdentityTopUpTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityTopUpTransition.signature = value
  }

  getSignableBytes (): Uint8Array {
    return this._rawIdentityTopUpTransition.getSignableBytes()
  }

  getModifiedDataIds (): IdentifierWASM[] {
    return this._rawIdentityTopUpTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance)
  }

  getOptionalAssetLockProof (): AssetLockProofWASM | undefined {
    const lock = this._rawIdentityTopUpTransition.getOptionalAssetLockProof()
    return (lock != null) ? AssetLockProofWASM.createFromRawInstance(lock) : undefined
  }

  calculateMinRequiredFee (platformVersion?: PlatformVersionNAPI): bigint {
    return BigInt(this._rawIdentityTopUpTransition.calculateMinRequiredFee(platformVersion))
  }

  bytes (): Uint8Array {
    return this._rawIdentityTopUpTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityTopUpTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityTopUpTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityTopUpTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityTopUpTransitionWASM {
    return IdentityTopUpTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityTopUpTransitionWASM {
    return IdentityTopUpTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityTopUpTransitionWASM {
    return IdentityTopUpTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityTopUpTransitionWASM {
    return IdentityTopUpTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityTopUpTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityTopUpTransitionNAPI): IdentityTopUpTransitionWASM {
    const instance: IdentityTopUpTransitionWASM = Object.create(IdentityTopUpTransitionWASM.prototype)
    instance._rawIdentityTopUpTransition = rawInstance

    return instance
  }
}
