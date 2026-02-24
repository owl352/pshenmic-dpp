import type { CoreScriptNAPI } from '../../../binaries/bindingsTypes.js'
import { dppProvider } from '../provider.js'
import { NetworkLike } from '../types.js'
import { valueToDynamicValue } from '../utils.js'

export class CoreScriptWASM {
  _rawCoreScript: CoreScriptNAPI

  toAddress (network: NetworkLike): string {
    return this._rawCoreScript.toAddress(valueToDynamicValue(network))
  }

  toString (): string {
    return this._rawCoreScript.toString()
  }

  bytes (): Uint8Array {
    return this._rawCoreScript.bytes()
  }

  hex (): string {
    return this._rawCoreScript.hex()
  }

  base64 (): string {
    return this._rawCoreScript.base64()
  }

  ASMString (): string {
    return this._rawCoreScript.ASMString()
  }

  static fromBytes (bytes: Uint8Array): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(
      dppProvider.dpp.CoreScriptNAPI.fromBytes(bytes)
    )
  }

  static newP2PKH (keyHash: Uint8Array): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(
      dppProvider.dpp.CoreScriptNAPI.newP2PKH(keyHash)
    )
  }

  static newP2SH (scriptHash: Uint8Array): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(
      dppProvider.dpp.CoreScriptNAPI.newP2SH(scriptHash)
    )
  }

  static createFromRawInstance (rawInstance: CoreScriptNAPI): CoreScriptWASM {
    const instance: CoreScriptWASM = Object.create(CoreScriptWASM.prototype)
    instance._rawCoreScript = rawInstance

    return instance
  }
}
