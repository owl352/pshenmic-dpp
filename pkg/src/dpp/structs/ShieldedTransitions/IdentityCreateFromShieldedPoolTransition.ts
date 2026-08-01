import type { PlatformVersionNAPI, IdentityCreateFromShieldedPoolTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js'
import { IdentifierWASM } from '../Identifier.js'
import { IdentifierLike, PlatformAddressLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue, preparePlatformAddressValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

export class IdentityCreateFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawIdentityCreateFromShieldedPoolTransition: IdentityCreateFromShieldedPoolTransitionNAPI

  constructor (
    publicKeys: IdentityPublicKeyInCreationWASM[],
    denomination: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    sendToAddressOnCreationFailure: PlatformAddressLike,
    identityId: IdentifierLike
  ) {
    this._rawIdentityCreateFromShieldedPoolTransition = new dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI(
      publicKeys.map(k => k._rawKeyInCreation),
      denomination.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingsSignature,
      preparePlatformAddressValue(sendToAddressOnCreationFailure),
      prepareIdentifierValue(identityId)
    )
  }

  get publicKeys (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityCreateFromShieldedPoolTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance)
  }

  set publicKeys (value: IdentityPublicKeyInCreationWASM[]) {
    this._rawIdentityCreateFromShieldedPoolTransition.publicKeys = value.map(k => k._rawKeyInCreation)
  }

  get denomination (): bigint {
    return BigInt(this._rawIdentityCreateFromShieldedPoolTransition.denomination)
  }

  set denomination (value: bigint) {
    this._rawIdentityCreateFromShieldedPoolTransition.denomination = value.toString()
  }

  get actions (): SerializedActionWASM[] {
    return this._rawIdentityCreateFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawIdentityCreateFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature = value
  }

  get sendToAddressOnCreationFailure (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure)
  }

  set sendToAddressOnCreationFailure (value: PlatformAddressLike) {
    this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure = preparePlatformAddressValue(value)
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawIdentityCreateFromShieldedPoolTransition.identityId = prepareIdentifierValue(value)
  }

  static computeMinimumFee (
    numActions: number,
    numKeys: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(numActions, numKeys, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreateFromShieldedPoolTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): IdentityCreateFromShieldedPoolTransitionWASM {
    return IdentityCreateFromShieldedPoolTransitionWASM.createFromRawInstance(
      dppProvider.dpp.IdentityCreateFromShieldedPoolTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreateFromShieldedPoolTransitionNAPI): IdentityCreateFromShieldedPoolTransitionWASM {
    const instance: IdentityCreateFromShieldedPoolTransitionWASM = Object.create(IdentityCreateFromShieldedPoolTransitionWASM.prototype)
    instance._rawIdentityCreateFromShieldedPoolTransition = rawInstance

    return instance
  }
}