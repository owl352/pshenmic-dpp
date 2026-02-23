import type { WitnessNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class WitnessWASM {
  /** @private **/
  _rawWitness: WitnessNAPI

  constructor (bytes?: Uint8Array[]) {
    this._rawWitness = new dppProvider.dpp.WitnessNAPI(bytes)
  }

  getBytes (): Uint8Array[] {
    return this._rawWitness.getBytes()
  }

  isEmpty (): boolean {
    return this._rawWitness.isEmpty()
  }

  clear (): void {
    this._rawWitness.clear()
  }

  push (value: Uint8Array): void {
    this._rawWitness.push(value)
  }

  static createFromRawInstance (rawInstance: WitnessNAPI): WitnessWASM {
    const instance: WitnessWASM = Object.create(this.prototype)
    instance._rawWitness = rawInstance

    return instance
  }
}
