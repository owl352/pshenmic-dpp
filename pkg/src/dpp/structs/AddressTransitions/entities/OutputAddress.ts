import type { OutputAddressNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../provider.js'
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js'
import { PlatformAddressLike } from '../../../types.js'
import { preparePlatformAddressValue } from '../../../utils.js'

export class OutputAddressWASM {
  /** @private **/
  _rawOutputAddress: OutputAddressNAPI

  constructor (address: PlatformAddressLike, credits: bigint) {
    this._rawOutputAddress = new dppProvider.dpp.OutputAddressNAPI(preparePlatformAddressValue(address), credits.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddress.address)
  }

  set address (address: PlatformAddressLike) {
    this._rawOutputAddress.address = preparePlatformAddressValue(address)
  }

  get credits (): bigint {
    return BigInt(this._rawOutputAddress.credits)
  }

  set credits (credits: bigint) {
    this._rawOutputAddress.credits = credits.toString()
  }

  static createFromRawInstance (rawInstance: OutputAddressNAPI): OutputAddressWASM {
    const instance: OutputAddressWASM = Object.create(OutputAddressWASM.prototype)
    instance._rawOutputAddress = rawInstance

    return instance
  }
}
