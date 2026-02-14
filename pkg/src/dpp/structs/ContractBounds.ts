import {ContractBoundsNAPI} from "../../../binaries/bindingsTypes.js";
import {IdentifierLike} from "../types.js";
import {dppProvider} from "../provider.js";
import {prepareIdentifierValue} from "../utils.js";
import {IdentifierWASM} from "./Identifier.js";

export class ContractBoundsWASM {
  /** @private **/
  _rawContractBounds: ContractBoundsNAPI

  constructor(contractId: IdentifierLike, documentTypeName?: string) {
    this._rawContractBounds = new dppProvider.dpp.ContractBoundsNAPI(prepareIdentifierValue(contractId), documentTypeName);
  }

  get identifier(): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawContractBounds.identifier)
  }

  get documentTypeName(): string | null {
    return this._rawContractBounds.documentTypeName
  }

  get contractBoundsType(): string {
    return this._rawContractBounds.contractBoundsType
  }

  get contractBoundsTypeNumber(): number {
    return this._rawContractBounds.contractBoundsTypeNumber
  }

  set identifier(value: IdentifierLike) {
    this._rawContractBounds.identifier = prepareIdentifierValue(value)
  }

  set documentTypeName(value: string) {
    this._rawContractBounds.documentTypeName = value
  }

  static SingleContract(contractId: IdentifierLike): ContractBoundsWASM {
    return new ContractBoundsWASM(contractId)
  }

  static SingleContractDocumentType(contractId: IdentifierLike, documentTypeName: string): ContractBoundsWASM {
    return new ContractBoundsWASM(contractId, documentTypeName);
  }

  static createFromRawInstance(rawInstance: ContractBoundsNAPI): ContractBoundsWASM {
    const instance: ContractBoundsWASM = Object.create(this.prototype)
    instance._rawContractBounds = rawInstance

    return instance
  }
}
