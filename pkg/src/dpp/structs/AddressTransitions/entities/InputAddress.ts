import type { InputAddressNAPI } from '../../../../../binaries/bindingsTypes.js'
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js'
import { dppProvider } from '../../../provider.js'
import { PlatformAddressLike } from '../../../types.js'
import { preparePlatformAddressValue } from '../../../utils.js'

export class InputAddressWASM {
  /** @private **/
  _rawInputAddress: InputAddressNAPI

  constructor (address: PlatformAddressLike, nonce: number, credits: bigint) {
    this._rawInputAddress = new dppProvider.dpp.InputAddressNAPI(preparePlatformAddressValue(address), nonce, credits.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawInputAddress.address)
  }

  set address (value: PlatformAddressLike) {
    this._rawInputAddress.address = preparePlatformAddressValue(value)
  }

  get nonce (): number {
    return this._rawInputAddress.nonce
  }

  set nonce (value: number) {
    this._rawInputAddress.nonce = value
  }

  get credits (): bigint {
    return BigInt(this._rawInputAddress.credits)
  }

  set credits (value: bigint) {
    this._rawInputAddress.credits = value.toString()
  }

  static createFromRawInstance (rawInstance: InputAddressNAPI): InputAddressWASM {
    const instance: InputAddressWASM = Object.create(InputAddressWASM.prototype)
    instance._rawInputAddress = rawInstance

    return instance
  }
}
