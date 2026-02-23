import type { TokenPaymentInfoNAPI } from '../../../../binaries/bindingsTypes.js'
import { GasFeesPaidByLike, IdentifierLike } from '../../types.js'
import { dppProvider } from '../../provider.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../Identifier.js'

export class TokenPaymentInfoWASM {
  /** @private **/
  _rawTokenPaymentInfo: TokenPaymentInfoNAPI

  constructor (
    paymentTokenContractId: IdentifierLike | undefined | null,
    tokenContractPosition: number,
    minimumTokenCost?: bigint,
    maximumTokenCost?: bigint,
    gasFeesPaidBy?: GasFeesPaidByLike
  ) {
    this._rawTokenPaymentInfo = new dppProvider.dpp.TokenPaymentInfoNAPI(
      paymentTokenContractId != null ? prepareIdentifierValue(paymentTokenContractId) : undefined,
      tokenContractPosition,
      minimumTokenCost?.toString(),
      maximumTokenCost?.toString(),
      valueToDynamicValue(gasFeesPaidBy)
    )
  }

  get paymentTokenContractId (): IdentifierWASM | undefined {
    const id = this._rawTokenPaymentInfo.paymentTokenContractId

    if (id != null) {
      return IdentifierWASM.createFromRawInstance(id)
    }
  }

  set paymentTokenContractId (id: IdentifierWASM | undefined) {
    this._rawTokenPaymentInfo.paymentTokenContractId = id != null ? prepareIdentifierValue(id) : undefined
  }

  get tokenContractPosition (): number {
    return this._rawTokenPaymentInfo.tokenContractPosition
  }

  set tokenContractPosition (position: number) {
    this._rawTokenPaymentInfo.tokenContractPosition = position
  }

  get minimumTokenCost (): bigint | undefined {
    const cost = this._rawTokenPaymentInfo.minimumTokenCost

    if (cost != null) {
      return BigInt(cost)
    }
  }

  set minimumTokenCost (cost: bigint | undefined) {
    this._rawTokenPaymentInfo.minimumTokenCost = cost?.toString()
  }

  get maximumTokenCost (): bigint | undefined {
    const cost = this._rawTokenPaymentInfo.maximumTokenCost

    if (cost != null) {
      return BigInt(cost)
    }
  }

  set maximumTokenCost (cost: bigint | undefined) {
    this._rawTokenPaymentInfo.maximumTokenCost = cost?.toString()
  }

  get gasFeesPaidBy (): string {
    return this._rawTokenPaymentInfo.gasFeesPaidBy
  }

  set gasFeesPaidBy (value: GasFeesPaidByLike) {
    this._rawTokenPaymentInfo.gasFeesPaidBy = valueToDynamicValue(value)
  }

  static crateFromRawInstance (rawInstance: TokenPaymentInfoNAPI): TokenPaymentInfoWASM {
    const instance: TokenPaymentInfoWASM = Object.create(this.prototype)
    instance._rawTokenPaymentInfo = rawInstance

    return instance
  }
}
