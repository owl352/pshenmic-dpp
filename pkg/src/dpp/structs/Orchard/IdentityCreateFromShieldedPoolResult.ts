import type { IdentityCreateFromShieldedPoolResultNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierWASM } from '../Identifier.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js'

/**
 * Result of `identityCreateFromShieldedPool`: the new identity's keys (with
 * proof-of-possession signatures), the proven Orchard bundle fields, the derived
 * identity id, and the client-predicted fee.
 */
export class IdentityCreateFromShieldedPoolResultWASM {
  /** @private **/
  _rawIdentityCreateFromShieldedPoolResult: IdentityCreateFromShieldedPoolResultNAPI

  get publicKeys (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityCreateFromShieldedPoolResult.publicKeys.map(
      IdentityPublicKeyInCreationWASM.createFromRawInstance
    )
  }

  get identityId (): IdentifierWASM {
    return new IdentifierWASM(this._rawIdentityCreateFromShieldedPoolResult.identityId)
  }

  get predictedFee (): bigint {
    return BigInt(this._rawIdentityCreateFromShieldedPoolResult.predictedFee)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawIdentityCreateFromShieldedPoolResult.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  get anchor (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolResult.anchor
  }

  get proof (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolResult.proof
  }

  get bindingsSignature (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolResult.bindingsSignature
  }

  static createFromRawInstance (
    rawInstance: IdentityCreateFromShieldedPoolResultNAPI
  ): IdentityCreateFromShieldedPoolResultWASM {
    const instance: IdentityCreateFromShieldedPoolResultWASM =
      Object.create(IdentityCreateFromShieldedPoolResultWASM.prototype)
    instance._rawIdentityCreateFromShieldedPoolResult = rawInstance

    return instance
  }
}