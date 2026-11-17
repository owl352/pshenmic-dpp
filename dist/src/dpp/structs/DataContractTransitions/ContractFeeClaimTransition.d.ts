import type { ContractFeeClaimTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike, ContractFeePotLike } from '../../../dpp/types.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Claims the credits a contract fee pot collected **/
export declare class ContractFeeClaimTransitionWASM {
    /** @private **/
    _rawContractFeeClaimTransition: ContractFeeClaimTransitionNAPI;
    constructor(ownerId: IdentifierLike, dataContractId: IdentifierLike, identityContractNonce: bigint, pot: ContractFeePotLike, userFeeIncrease?: number);
    get ownerId(): IdentifierWASM;
    set ownerId(value: IdentifierLike);
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    get identityContractNonce(): bigint;
    set identityContractNonce(value: bigint);
    get pot(): string;
    set pot(value: ContractFeePotLike);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): ContractFeeClaimTransitionWASM;
    static createFromRawInstance(rawInstance: ContractFeeClaimTransitionNAPI): ContractFeeClaimTransitionWASM;
}
