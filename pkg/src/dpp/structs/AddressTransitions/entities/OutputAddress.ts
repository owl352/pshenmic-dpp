import { OutputAddressNAPI } from '../../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../../provider.js'
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js'

export class OutputAddressWASM {
  /** @private **/
  _rawOutputAddress: OutputAddressNAPI

  constructor (address: PlatformAddressWASM, credits: bigint) {
    this._rawOutputAddress = new dppProvider.dpp.OutputAddressNAPI(address._rawPlatformAddress, credits.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddress.address)
  }

  set address (address: PlatformAddressWASM) {
    this._rawOutputAddress.address = address._rawPlatformAddress
  }

  get credits (): bigint {
    return BigInt(this._rawOutputAddress.credits)
  }

  set credits (credits: bigint) {
    this._rawOutputAddress.credits = credits.toString()
  }

  static createFromRawInstance (rawInstance: OutputAddressNAPI): OutputAddressWASM {
    const instance: OutputAddressWASM = Object.create(this.prototype)
    instance._rawOutputAddress = rawInstance

    return instance
  }
}
