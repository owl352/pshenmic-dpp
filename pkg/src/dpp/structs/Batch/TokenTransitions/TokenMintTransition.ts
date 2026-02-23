import type { TokenMintTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenMintTransitionWASM {
  /** @private **/
  _rawTransition: TokenMintTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    issueToIdentityId: IdentifierLike | undefined,
    amount: bigint,
    publicNote?: string
  ) {
    this._rawTransition = new dppProvider.dpp.TokenMintTransitionNAPI(
      base._rawTokenBaseTransition,
      issueToIdentityId != null ? prepareIdentifierValue(issueToIdentityId) : undefined,
      amount.toString(),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTransition.base = value._rawTokenBaseTransition
  }

  get issuedToIdentityId (): IdentifierWASM | undefined {
    const id = this._rawTransition.issuedToIdentityId

    if (id != null) {
      return IdentifierWASM.createFromRawInstance(id)
    }
  }

  set issuedToIdentityId (value: IdentifierLike | undefined) {
    this._rawTransition.issuedToIdentityId = value != null ? prepareIdentifierValue(value) : undefined
  }

  get amount (): bigint {
    return BigInt(this._rawTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTransition.amount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenMintTransitionNAPI): TokenMintTransitionWASM {
    const instance: TokenMintTransitionWASM = Object.create(this.prototype)
    instance._rawTransition = rawInstance

    return instance
  }
}
