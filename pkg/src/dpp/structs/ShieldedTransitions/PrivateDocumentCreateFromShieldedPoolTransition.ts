import type {
  PlatformVersionNAPI,
  PrivateDocumentCreateFromShieldedPoolTransitionNAPI
} from '../../../../binaries/bindingsTypes.js'
import { SerializedActionWASM } from './SerializedAction.js'
import { IdentifierWASM } from '../Identifier.js'
import { IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { StateTransitionWASM } from '../StateTransition.js'

/**
 * Appends entries to a private document type's store, paying from the credit
 * shielded pool (protocol version 15). The bundle's binding signature commits to
 * the contract, the document type name and every entry; there is no identity
 * signature.
 */
export class PrivateDocumentCreateFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawPrivateDocumentCreateFromShieldedPoolTransition: PrivateDocumentCreateFromShieldedPoolTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    documentTypeName: string,
    entries: Uint8Array[],
    actions: SerializedActionWASM[],
    valueBalance: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawPrivateDocumentCreateFromShieldedPoolTransition = new dppProvider.dpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI(
      prepareIdentifierValue(dataContractId),
      documentTypeName,
      entries,
      actions.map(a => a._rawSerializedAction),
      valueBalance.toString(),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawPrivateDocumentCreateFromShieldedPoolTransition.dataContractId)
  }

  get documentTypeName (): string {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.documentTypeName
  }

  get entries (): Uint8Array[] {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.entries
  }

  get actions (): SerializedActionWASM[] {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  get valueBalance (): bigint {
    return BigInt(this._rawPrivateDocumentCreateFromShieldedPoolTransition.valueBalance)
  }

  get anchor (): Uint8Array {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.anchor
  }

  get proof (): Uint8Array {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.proof
  }

  get bindingsSignature (): Uint8Array {
    return this._rawPrivateDocumentCreateFromShieldedPoolTransition.bindingSignature
  }

  static computeMinimumFee (
    numActions: number,
    entryCount: number,
    entrySize: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(
      dppProvider.dpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(
        numActions,
        entryCount,
        entrySize,
        platformVersion
      )
    )
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawPrivateDocumentCreateFromShieldedPoolTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): PrivateDocumentCreateFromShieldedPoolTransitionWASM {
    return PrivateDocumentCreateFromShieldedPoolTransitionWASM.createFromRawInstance(
      dppProvider.dpp.PrivateDocumentCreateFromShieldedPoolTransitionNAPI.fromStateTransition(
        st._rawStateTransition
      )
    )
  }

  static createFromRawInstance (
    rawInstance: PrivateDocumentCreateFromShieldedPoolTransitionNAPI
  ): PrivateDocumentCreateFromShieldedPoolTransitionWASM {
    const instance: PrivateDocumentCreateFromShieldedPoolTransitionWASM = Object.create(
      PrivateDocumentCreateFromShieldedPoolTransitionWASM.prototype
    )
    instance._rawPrivateDocumentCreateFromShieldedPoolTransition = rawInstance

    return instance
  }
}
