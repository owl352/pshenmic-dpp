import {BatchedTransitionNAPI, DocumentTransitionNAPI} from "../../../../binaries/bindingsTypes.js";
import {TokenTransitionWASM} from "./TokenTransition.js";
import {DocumentTransitionWASM} from "./DocumentTransition.js";
import {dppProvider} from "../../provider.js";
import {IdentifierWASM} from "../Identifier.js";
import {prepareIdentifierValue} from "../../utils.js";

export class BatchedTransitionWASM {
  /** @private **/
  _rawBatchedTransition: BatchedTransitionNAPI

  constructor(transition: TokenTransitionWASM | DocumentTransitionWASM) {
    let raw: BatchedTransitionNAPI

    if (transition instanceof DocumentTransitionWASM) {
      raw = new dppProvider.dpp.BatchedTransitionNAPI(
        transition._rawDocumentTransition
      )
    } else {
      raw = new dppProvider.dpp.BatchedTransitionNAPI(
        transition._rawTokenTransition
      )
    }

    this._rawBatchedTransition = raw
  }

  get dataContractId(): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawBatchedTransition.dataContractId)
  }

  set dataContractId(value: IdentifierWASM) {
    this._rawBatchedTransition.dataContractId = prepareIdentifierValue(value)
  }

  toTransition(): DocumentTransitionWASM | TokenTransitionWASM {
    const raw = this._rawBatchedTransition.toTransition()

    if (raw instanceof DocumentTransitionNAPI) {
      return DocumentTransitionWASM.createFromRawInstance(raw)
    } else{
      return TokenTransitionWASM.createFromRawInstance(raw)
    }
  }

  static createFromRawInstance(rawInstance: BatchedTransitionNAPI): BatchedTransitionWASM {
    const instance: BatchedTransitionWASM = Object.create(this.prototype)
    instance._rawBatchedTransition = rawInstance

    return instance
  }
}
