import { TokenMintTransitionNAPI } from '../../../../../binaries/bindingsTypes.js'
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js'
import { IdentifierLike } from '../../../types.js'
import { dppProvider } from '../../../provider.js'
import { prepareIdentifierValue } from '../../../utils.js'
import { IdentifierWASM } from '../../Identifier.js'

export class TokenMintTransitionWASM {
  /** @private **/
  _rawTokenMintTransition: TokenMintTransitionNAPI

  constructor (
    base: TokenBaseTransitionWASM,
    amount: bigint,
    issueToIdentityId?: IdentifierLike,
    publicNote?: string
  ) {
    this._rawTokenMintTransition = new dppProvider.dpp.TokenMintTransitionNAPI(
      base._rawTokenBaseTransition,
      issueToIdentityId != null ? prepareIdentifierValue(issueToIdentityId) : undefined,
      amount.toString(),
      publicNote
    )
  }

  get base (): TokenBaseTransitionWASM {
    return TokenBaseTransitionWASM.createFromRawInstance(
      this._rawTokenMintTransition.base
    )
  }

  set base (value: TokenBaseTransitionWASM) {
    this._rawTokenMintTransition.base = value._rawTokenBaseTransition
  }

  get issuedToIdentityId (): IdentifierWASM | undefined {
    const id = this._rawTokenMintTransition.issuedToIdentityId

    if (id != null) {
      return IdentifierWASM.createFromRawInstance(id)
    }
  }

  set issuedToIdentityId (value: IdentifierLike | undefined) {
    this._rawTokenMintTransition.issuedToIdentityId = value != null ? prepareIdentifierValue(value) : undefined
  }

  get amount (): bigint {
    return BigInt(this._rawTokenMintTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTokenMintTransition.amount = value.toString()
  }

  get publicNote (): string | undefined {
    return this._rawTokenMintTransition.publicNote ?? undefined
  }

  set publicNote (value: string | undefined) {
    this._rawTokenMintTransition.publicNote = value
  }

  static createFromRawInstance (rawInstance: TokenMintTransitionNAPI): TokenMintTransitionWASM {
    const instance: TokenMintTransitionWASM = Object.create(this.prototype)
    instance._rawTokenMintTransition = rawInstance

    return instance
  }
}
