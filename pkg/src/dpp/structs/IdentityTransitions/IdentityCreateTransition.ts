import type { IdentityCreateTransitionNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { dppProvider } from '../../provider.js'
import { PlatformVersionLike } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreateTransitionWASM {
  /** @private **/
  _rawIdentityCreateTransition: IdentityCreateTransitionNAPI

  constructor (publicKeys: IdentityPublicKeyInCreationWASM[], assetLockProof: AssetLockProofWASM, signature?: Uint8Array, userFeeIncrease?: number) {
    this._rawIdentityCreateTransition = new dppProvider.dpp.IdentityCreateTransitionNAPI(
      publicKeys.map(publicKey => publicKey._rawKeyInCreation),
      assetLockProof._rawAssetLockProof,
      signature,
      userFeeIncrease
    )
  }

  get publicKeys (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityCreateTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance)
  }

  set publicKeys (publicKeys: IdentityPublicKeyInCreationWASM[]) {
    this._rawIdentityCreateTransition.publicKeys = publicKeys.map(publicKey => publicKey._rawKeyInCreation)
  }

  get userFeeIncrease (): number {
    return this._rawIdentityCreateTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityCreateTransition.userFeeIncrease = value
  }

  get signature (): Uint8Array {
    return this._rawIdentityCreateTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityCreateTransition.signature = value
  }

  get assetLock (): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(this._rawIdentityCreateTransition.assetLock)
  }

  set assetLock (value: AssetLockProofWASM) {
    this._rawIdentityCreateTransition.assetLock = value._rawAssetLockProof
  }

  getSignableBytes (): Uint8Array {
    return this._rawIdentityCreateTransition.getSignableBytes()
  }

  getIdentifier (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreateTransition.getIdentifier())
  }

  calculateMinRequiredFee (platformVersion?: PlatformVersionNAPI): bigint {
    return BigInt(this._rawIdentityCreateTransition.calculateMinRequiredFee(platformVersion))
  }

  bytes (): Uint8Array {
    return this._rawIdentityCreateTransition.bytes()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreateTransition.toStateTransition()
    )
  }

  static default (platformVersion: PlatformVersionLike): IdentityCreateTransitionWASM {
    return IdentityCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateTransitionNAPI.default(valueToDynamicValue(platformVersion))
    )
  }

  static fromHex (hex: string): IdentityCreateTransitionWASM {
    return IdentityCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityCreateTransitionWASM {
    return IdentityCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateTransitionNAPI.fromBase64(base64)
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityCreateTransitionWASM {
    return IdentityCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityCreateTransitionWASM {
    return IdentityCreateTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreateTransitionNAPI): IdentityCreateTransitionWASM {
    const instance: IdentityCreateTransitionWASM = Object.create(IdentityCreateTransitionWASM.prototype)
    instance._rawIdentityCreateTransition = rawInstance

    return instance
  }
}
