import type { TokenBaseTransitionNAPI } from '../../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../../types.js'
import { GroupStateTransitionInfoWASM } from '../GroupStateTransitionInfo.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class TokenBaseTransitionWASM {
  /** @private **/
  _rawTokenBaseTransition: TokenBaseTransitionNAPI

  constructor (
    identityContractNonce: bigint,
    tokenContractPosition: number,
    dataContractId: IdentifierLike,
    tokenId: IdentifierLike,
    usingGroupInfo?: GroupStateTransitionInfoWASM
  ) {
    this._rawTokenBaseTransition = new dppProvider.dpp.TokenBaseTransitionNAPI(
      identityContractNonce.toString(),
      tokenContractPosition,
      prepareIdentifierValue(dataContractId),
      prepareIdentifierValue(tokenId),
      usingGroupInfo?._rawGroupStateTransitionInfo
    )
  }

  get identityContractNonce (): bigint {
    return BigInt(this._rawTokenBaseTransition.identityContractNonce)
  }

  set identityContractNonce (value: bigint) {
    this._rawTokenBaseTransition.identityContractNonce = value.toString()
  }

  get tokenContractPosition (): number {
    return this._rawTokenBaseTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenBaseTransition.tokenContractPosition = value
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenBaseTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenBaseTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenBaseTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenBaseTransition.tokenId = prepareIdentifierValue(value)
  }

  get usingGroupInfo (): GroupStateTransitionInfoWASM | undefined {
    const info = this._rawTokenBaseTransition.usingGroupInfo
    if (info != null) {
      return GroupStateTransitionInfoWASM.createFromRawInstance(info)
    }
  }

  set usingGroupInfo (value: GroupStateTransitionInfoWASM | undefined) {
    this._rawTokenBaseTransition.usingGroupInfo = value?._rawGroupStateTransitionInfo
  }

  static createFromRawInstance (rawInstance: TokenBaseTransitionNAPI): TokenBaseTransitionWASM {
    const instance: TokenBaseTransitionWASM = Object.create(TokenBaseTransitionWASM.prototype)
    instance._rawTokenBaseTransition = rawInstance

    return instance
  }
}
