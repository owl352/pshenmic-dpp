import type {
  OutputAddressNullableCreditsNAPI
} from '../../../../../binaries/bindingsTypes.js'
import { PlatformAddressWASM } from '../../PlatformAddress/PlatformAddress.js'
import { dppProvider } from '../../../provider.js'
import { PlatformAddressLike } from '../../../types.js'
import { preparePlatformAddressValue } from '../../../utils.js'

export class OutputAddressNullableCreditsWASM {
  /** @private **/
  _rawOutputAddressNullableCredits: OutputAddressNullableCreditsNAPI

  constructor (address: PlatformAddressLike, credits?: bigint) {
    this._rawOutputAddressNullableCredits = new dppProvider.dpp.OutputAddressNullableCreditsNAPI(preparePlatformAddressValue(address), credits?.toString())
  }

  get address (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawOutputAddressNullableCredits.address)
  }

  set address (address: PlatformAddressLike) {
    this._rawOutputAddressNullableCredits.address = preparePlatformAddressValue(address)
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
    const instance: OutputAddressNullableCreditsWASM = Object.create(OutputAddressNullableCreditsWASM.prototype)
    instance._rawOutputAddressNullableCredits = rawInstance

    return instance
  }
}
