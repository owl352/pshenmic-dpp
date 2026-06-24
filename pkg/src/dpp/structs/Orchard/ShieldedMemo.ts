import type { ShieldedMemoNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class ShieldedMemoWASM {
  /** @private **/
  _rawShieldedMemo: ShieldedMemoNAPI

  toString (): string {
    return this._rawShieldedMemo.toString()
  }

  toBytes (): Uint8Array {
    return this._rawShieldedMemo.toBytes()
  }

  static empty (): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      dppProvider.dpp.ShieldedMemoNAPI.empty()
    )
  }

  static fromString (value: string): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      dppProvider.dpp.ShieldedMemoNAPI.fromString(value)
    )
  }

  static other (kind: number, payload: Uint8Array): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      dppProvider.dpp.ShieldedMemoNAPI.other(kind, payload)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedMemoNAPI): ShieldedMemoWASM {
    const instance: ShieldedMemoWASM = Object.create(ShieldedMemoWASM.prototype)
    instance._rawShieldedMemo = rawInstance

    return instance
  }
}