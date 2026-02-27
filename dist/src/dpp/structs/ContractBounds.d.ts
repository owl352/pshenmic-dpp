import type { ContractBoundsNAPI } from '../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../types.js';
import { IdentifierWASM } from './Identifier.js';
export declare class ContractBoundsWASM {
    /** @private **/
    _rawContractBounds: ContractBoundsNAPI;
    constructor(contractId: IdentifierLike, documentTypeName?: string);
    get identifier(): IdentifierWASM;
    set identifier(value: IdentifierLike);
    get documentTypeName(): string | null;
    set documentTypeName(value: string);
    get contractBoundsType(): string;
    get contractBoundsTypeNumber(): number;
    static SingleContract(contractId: IdentifierLike): ContractBoundsWASM;
    static SingleContractDocumentType(contractId: IdentifierLike, documentTypeName: string): ContractBoundsWASM;
    static createFromRawInstance(rawInstance: ContractBoundsNAPI): ContractBoundsWASM;
}
