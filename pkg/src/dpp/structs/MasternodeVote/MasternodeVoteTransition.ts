import type { MasternodeVoteTransitionNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { VoteWASM } from './Vote.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class MasternodeVoteTransitionWASM {
  /** @private **/
  _rawMasternodeVoteTransition: MasternodeVoteTransitionNAPI

  constructor (proTxHash: IdentifierLike, voterId: IdentifierLike, vote: VoteWASM, nonce: bigint, signaturePublicKey?: number, signature?: Uint8Array) {
    this._rawMasternodeVoteTransition = new dppProvider.dpp.MasternodeVoteTransitionNAPI(
      prepareIdentifierValue(proTxHash),
      prepareIdentifierValue(voterId),
      vote._rawVote,
      nonce.toString(),
      signaturePublicKey,
      signature
    )
  }

  get proTxHash (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawMasternodeVoteTransition.proTxHash)
  }

  set proTxHash (id: IdentifierLike) {
    this._rawMasternodeVoteTransition.proTxHash = prepareIdentifierValue(id)
  }

  get voterIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawMasternodeVoteTransition.voterIdentityId)
  }

  set voterIdentityId (id: IdentifierLike) {
    this._rawMasternodeVoteTransition.voterIdentityId = prepareIdentifierValue(id)
  }

  get vote (): VoteWASM {
    return VoteWASM.createFromRawInstance(this._rawMasternodeVoteTransition.vote)
  }

  set vote (vote: VoteWASM) {
    this._rawMasternodeVoteTransition.vote = vote._rawVote
  }

  get nonce (): bigint {
    return BigInt(this._rawMasternodeVoteTransition.nonce)
  }

  set nonce (nonce: bigint) {
    this._rawMasternodeVoteTransition.nonce = nonce.toString()
  }

  get signaturePublicKeyId (): number {
    return this._rawMasternodeVoteTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (keyId: number) {
    this._rawMasternodeVoteTransition.signaturePublicKeyId = keyId
  }

  get signature (): Uint8Array {
    return this._rawMasternodeVoteTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawMasternodeVoteTransition.signature = value
  }

  get assetLock (): AssetLockProofWASM | undefined {
    const lock = this._rawMasternodeVoteTransition.assetLock

    if (lock != null) {
      return AssetLockProofWASM.createFromRawInstance(lock)
    }
  }

  get modifiedDataIds (): IdentifierWASM[] {
    return this._rawMasternodeVoteTransition.modifiedDataIds.map(IdentifierWASM.createFromRawInstance)
  }

  getSignableBytes (): Uint8Array {
    return this._rawMasternodeVoteTransition.getSignableBytes()
  }

  calculateMinRequiredFee (platformVersion?: PlatformVersionNAPI): bigint {
    return BigInt(this._rawMasternodeVoteTransition.calculateMinRequiredFee(platformVersion))
  }

  bytes (): Uint8Array {
    return this._rawMasternodeVoteTransition.bytes()
  }

  hex (): string {
    return this._rawMasternodeVoteTransition.hex()
  }

  base64 (): string {
    return this._rawMasternodeVoteTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawMasternodeVoteTransition.toStateTransition())
  }

  static fromBytes (bytes: Uint8Array): MasternodeVoteTransitionWASM {
    return MasternodeVoteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.MasternodeVoteTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): MasternodeVoteTransitionWASM {
    return MasternodeVoteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.MasternodeVoteTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): MasternodeVoteTransitionWASM {
    return MasternodeVoteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.MasternodeVoteTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): MasternodeVoteTransitionWASM {
    return MasternodeVoteTransitionWASM.createFromRawInstance(
      dppProvider.dpp.MasternodeVoteTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: MasternodeVoteTransitionNAPI): MasternodeVoteTransitionWASM {
    const instance: MasternodeVoteTransitionWASM = Object.create(MasternodeVoteTransitionWASM.prototype)
    instance._rawMasternodeVoteTransition = rawInstance

    return instance
  }
}
