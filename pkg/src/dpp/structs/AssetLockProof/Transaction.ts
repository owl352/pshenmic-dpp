import { TransactionNAPI } from '../../../../binaries/bindingsTypes.js'
import { TxInWASM } from './TxIn.js'
import { TxOutWASM } from './TxOut.js'
import { dppProvider } from '../../provider.js'

export class TransactionWASM {
  /** @private **/
  _rawTransaction: TransactionNAPI

  constructor (version: number, lockTime: number | Date, inputs: TxInWASM[], outputs: TxOutWASM[]) {
    const normalLockTime = typeof lockTime === 'number' ? lockTime : lockTime.getTime()

    this._rawTransaction = new dppProvider.dpp.TransactionNAPI(
      version,
      normalLockTime,
      inputs.map(input => input._rawTxIn),
      outputs.map(output => output._rawTxOut)
    )
  }

  get version (): number {
    return this._rawTransaction.version
  }

  set version (version: number) {
    this._rawTransaction.version = version
  }

  get lockTime (): number {
    return this._rawTransaction.lockTime
  }

  set lockTime (lockTime: number | Date) {
    this._rawTransaction.lockTime = typeof lockTime === 'number' ? lockTime : lockTime.getTime()
  }

  get input (): TxInWASM[] {
    return this._rawTransaction.input.map(TxInWASM.createFromRawInstance)
  }

  set input (input: TxInWASM[]) {
    this._rawTransaction.input = input.map(input => input._rawTxIn)
  }

  get output (): TxOutWASM[] {
    return this._rawTransaction.output.map(TxOutWASM.createFromRawInstance)
  }

  set output (output: TxOutWASM[]) {
    this._rawTransaction.output = output.map(output => output._rawTxOut)
  }

  isCoinBase (): boolean {
    return this._rawTransaction.isCoinBase()
  }

  getTxType (): string {
    return this._rawTransaction.getTxType()
  }

  getTxId (): string {
    return this._rawTransaction.getTxId()
  }

  static createFromRawInstance (rawInstance: TransactionNAPI): TransactionWASM {
    const instance: TransactionWASM = Object.create(this.prototype)
    instance._rawTransaction = rawInstance

    return instance
  }
}
