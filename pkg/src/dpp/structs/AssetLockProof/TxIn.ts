import type { TxInNAPI } from '../../../../binaries/bindingsTypes.js'
import { OutPointWASM } from './OutPoint.js'
import { WitnessWASM } from './Witness.js'
import { dppProvider } from '../../provider.js'

export class TxInWASM {
  /** @private **/
  _rawTxIn: TxInNAPI

  constructor (previousOutPoint: OutPointWASM, scriptSig: Uint8Array, sequency: number, witness: WitnessWASM) {
    this._rawTxIn = new dppProvider.dpp.TxInNAPI(previousOutPoint._rawOutPoint, scriptSig, sequency, witness._rawWitness)
  }

  get previousOutput (): OutPointWASM {
    return OutPointWASM.createFromRawInstance(this._rawTxIn.previousOutput)
  }

  set previousOutput (previousOutput: OutPointWASM) {
    this._rawTxIn.previousOutput = previousOutput._rawOutPoint
  }

  get scriptSig (): Uint8Array {
    return this._rawTxIn.scriptSig
  }

  set scriptSig (sig: Uint8Array) {
    this._rawTxIn.scriptSig = sig
  }

  get sequence (): number {
    return this._rawTxIn.sequence
  }

  set sequence (sequence: number) {
    this._rawTxIn.sequence = sequence
  }

  get witnesses (): WitnessWASM {
    return WitnessWASM.createFromRawInstance(this._rawTxIn.witnesses)
  }

  set witnesses (witness: WitnessWASM) {
    this._rawTxIn.witnesses = witness._rawWitness
  }

  static createFromRawInstance (rawInstance: TxInNAPI): TxInWASM {
    const instance: TxInWASM = Object.create(TxInWASM.prototype)
    instance._rawTxIn = rawInstance

    return instance
  }
}
