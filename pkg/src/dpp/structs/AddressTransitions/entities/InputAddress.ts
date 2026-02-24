import type { InputAddressNAPI } from '../../../../../binaries/bindingsTypes.js'
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js'
import { dppProvider } from '../../../provider.js'

export class InputAddressWASM {
  /** @private **/
  _rawInputAddress: InputAddressNAPI

  constructor (address: PlatformAddressWASM, nonce: number, credits: bigint) {
    this._rawInputAddress = new dppProvider.dpp.InputAddressNAPI(address._rawPlatformAddress, nonce, credits.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawInputAddress.address)
  }

  set address (value: PlatformAddressWASM) {
    this._rawInputAddress.address = value._rawPlatformAddress
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
