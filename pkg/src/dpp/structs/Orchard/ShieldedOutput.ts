import type { ShieldedOutputNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { OrchardAddressWASM } from './OrchardAddress.js'
import { ShieldedMemoWASM } from './ShieldedMemo.js'

/**
 * One output of a multi-output shielded transfer (`shieldedTransferMulti`):
 * who receives the note, how much, and the memo carried inside it.
 *
 * Each output holds its own memo — the single-recipient builders share one memo
 * across the bundle, which has nothing sensible to say when there are several
 * unrelated recipients.
 */
export class ShieldedOutputWASM {
  /** @private **/
  _rawShieldedOutput: ShieldedOutputNAPI

  constructor (address: OrchardAddressWASM, amount: bigint, memo: ShieldedMemoWASM) {
    this._rawShieldedOutput = new dppProvider.dpp.ShieldedOutputNAPI(
      address._rawOrchardAddress,
      amount.toString(),
      memo._rawShieldedMemo
    )
  }

  get address (): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(this._rawShieldedOutput.address)
  }

  set address (value: OrchardAddressWASM) {
    this._rawShieldedOutput.address = value._rawOrchardAddress
  }

  get amount (): bigint {
    return BigInt(this._rawShieldedOutput.amount)
  }

  set amount (value: bigint) {
    this._rawShieldedOutput.amount = value.toString()
  }

  get memo (): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(this._rawShieldedOutput.memo)
  }

  set memo (value: ShieldedMemoWASM) {
    this._rawShieldedOutput.memo = value._rawShieldedMemo
  }

  static createFromRawInstance (rawInstance: ShieldedOutputNAPI): ShieldedOutputWASM {
    const instance: ShieldedOutputWASM = Object.create(ShieldedOutputWASM.prototype)
    instance._rawShieldedOutput = rawInstance

    return instance
  }
}
