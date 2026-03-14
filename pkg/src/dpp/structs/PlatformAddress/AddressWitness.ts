import type { AddressWitnessNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { AddressWitnessP2PKH, AddressWitnessP2SH } from '../../types.js'

export class AddressWitnessWASM {
  /** @private **/
  _rawWitness: AddressWitnessNAPI

  private constructor (witness: AddressWitnessNAPI) {
    this._rawWitness = witness
  }

  static P2PKH (signature: Uint8Array): AddressWitnessWASM {
    return AddressWitnessWASM.createFromRawInstance(
      dppProvider.dpp.AddressWitnessNAPI.P2PKH(signature)
    )
  }

  static P2SH (signatures: Uint8Array[], redeemScript: Uint8Array): AddressWitnessWASM {
    return AddressWitnessWASM.createFromRawInstance(
      dppProvider.dpp.AddressWitnessNAPI.P2SH(signatures, redeemScript)
    )
  }

  getType (): string {
    return this._rawWitness.getType()
  }

  getValue (): AddressWitnessP2PKH | AddressWitnessP2SH {
    return this._rawWitness.getValue()
  }

  static createFromRawInstance (rawInstance: AddressWitnessNAPI): AddressWitnessWASM {
    return new AddressWitnessWASM(rawInstance)
  }
}
