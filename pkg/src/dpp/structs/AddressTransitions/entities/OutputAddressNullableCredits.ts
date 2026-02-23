import type {
  OutputAddressNullableCreditsNAPI
} from '../../../../../binaries/bindingsTypes.js'
import { PlatformAddressWASM } from '../../Address/PlatformAddress.js'
import { dppProvider } from '../../../provider.js'

export class OutputAddressNullableCreditsWASM {
  /** @private **/
  _rawOutputAddressNullableCredits: OutputAddressNullableCreditsNAPI

  constructor (address: PlatformAddressWASM, credits?: bigint) {
    this._rawOutputAddressNullableCredits = new dppProvider.dpp.OutputAddressNullableCreditsNAPI(address._rawPlatformAddress, credits?.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddressNullableCredits.address)
  }

  set address (address: PlatformAddressWASM) {
    this._rawOutputAddressNullableCredits.address = address._rawPlatformAddress
  }

  get credits (): BigInt | undefined {
    const credits = this._rawOutputAddressNullableCredits.credits

    if (credits != null) {
      return BigInt(credits)
    }
  }

  set credits (value: BigInt | undefined) {
    this._rawOutputAddressNullableCredits.credits = value?.toString()
  }

  static createFromRawInstance (rawInstance: OutputAddressNullableCreditsNAPI): OutputAddressNullableCreditsWASM {
    const instance: OutputAddressNullableCreditsWASM = Object.create(this.prototype)
    instance._rawOutputAddressNullableCredits = rawInstance

    return instance
  }
}
