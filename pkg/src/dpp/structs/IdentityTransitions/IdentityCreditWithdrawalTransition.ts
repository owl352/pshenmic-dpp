import { IdentityCreditWithdrawalTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike, PoolingLike } from '../../types.js'
import { CoreScriptWASM } from '../CoreScript.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreditWithdrawalTransitionWASM {
  /** @private **/
  _rawIdentityCreditWithdrawalTransition: IdentityCreditWithdrawalTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    amount: bigint,
    coreFeePerByte: number,
    pooling: PoolingLike,
    nonce: bigint,
    outputScript?: CoreScriptWASM,
    userFeeIncrease?: number
  ) {
    this._rawIdentityCreditWithdrawalTransition = new dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI(
      prepareIdentifierValue(identityId),
      amount.toString(),
      coreFeePerByte,
      valueToDynamicValue(pooling),
      nonce.toString(),
      outputScript?._rawCoreScript,
      userFeeIncrease
    )
  }

  get outputScript (): CoreScriptWASM | undefined {
    const script = this._rawIdentityCreditWithdrawalTransition.outputScript

    if (script != null) {
      return CoreScriptWASM.createFromRawInstance(script)
    }
  }

  set outputScript (script: CoreScriptWASM | undefined) {
    this._rawIdentityCreditWithdrawalTransition.outputScript = script?._rawCoreScript
  }

  get pooling (): string {
    return this._rawIdentityCreditWithdrawalTransition.pooling
  }

  set pooling (value: PoolingLike) {
    this._rawIdentityCreditWithdrawalTransition.pooling = valueToDynamicValue(value)
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreditWithdrawalTransition.identityId)
  }

  set identityId (value: IdentifierWASM) {
    this._rawIdentityCreditWithdrawalTransition.identityId = prepareIdentifierValue(value)
  }

  get userFeeIncrease (): number {
    return this._rawIdentityCreditWithdrawalTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawIdentityCreditWithdrawalTransition.userFeeIncrease = value
  }

  get nonce (): bigint {
    return BigInt(this._rawIdentityCreditWithdrawalTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawIdentityCreditWithdrawalTransition.nonce = value.toString()
  }

  get amount (): bigint {
    return BigInt(this._rawIdentityCreditWithdrawalTransition.amount)
  }

  set amount (value: bigint) {
    this._rawIdentityCreditWithdrawalTransition.amount = value.toString()
  }

  get coreFeePerByte (): number {
    return this._rawIdentityCreditWithdrawalTransition.coreFeePerByte
  }

  set coreFeePerByte (value: number) {
    this._rawIdentityCreditWithdrawalTransition.coreFeePerByte = value
  }

  get signature (): Uint8Array {
    return this._rawIdentityCreditWithdrawalTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawIdentityCreditWithdrawalTransition.signature = value
  }

  get signaturePublicKeyId (): number {
    return this._rawIdentityCreditWithdrawalTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawIdentityCreditWithdrawalTransition.signaturePublicKeyId = value
  }

  getSignableBytes (): Uint8Array {
    return this._rawIdentityCreditWithdrawalTransition.getSignableBytes()
  }

  getPurposeRequirement (): string[] {
    return this._rawIdentityCreditWithdrawalTransition.getPurposeRequirement()
  }

  getModifiedDataIds (): IdentifierWASM[] {
    return this._rawIdentityCreditWithdrawalTransition.getModifiedDataIds().map(IdentifierWASM.createFromRawInstance)
  }

  getOptionalAssetLockProof (): AssetLockProofWASM | undefined {
    const lock = this._rawIdentityCreditWithdrawalTransition.getOptionalAssetLockProof()

    if (lock != null) {
      return AssetLockProofWASM.createFromRawInstance(lock)
    }
  }

  bytes (): Uint8Array {
    return this._rawIdentityCreditWithdrawalTransition.bytes()
  }

  hex (): string {
    return this._rawIdentityCreditWithdrawalTransition.hex()
  }

  base64 (): string {
    return this._rawIdentityCreditWithdrawalTransition.base64()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreditWithdrawalTransition.toStateTransition()
    )
  }

  static fromBytes (bytes: Uint8Array): IdentityCreditWithdrawalTransitionWASM {
    return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromBytes(bytes)
    )
  }

  static fromHex (hex: string): IdentityCreditWithdrawalTransitionWASM {
    return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromHex(hex)
    )
  }

  static fromBase64 (base64: string): IdentityCreditWithdrawalTransitionWASM {
    return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromBase64(base64)
    )
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityCreditWithdrawalTransitionWASM {
    return IdentityCreditWithdrawalTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreditWithdrawalTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreditWithdrawalTransitionNAPI): IdentityCreditWithdrawalTransitionWASM {
    const instance: IdentityCreditWithdrawalTransitionWASM = Object.create(this.prototype)
    instance._rawIdentityCreditWithdrawalTransition = rawInstance

    return instance
  }
}
