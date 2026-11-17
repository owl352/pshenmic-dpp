import type { ContractUserModerationTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { IdentifierLike, ContractUserModerationAction } from '../../../dpp/types.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** A moderator action on a contract user or document. The action is a plain object tagged with `$type` **/
export declare class ContractUserModerationTransitionWASM {
    /** @private **/
    _rawContractUserModerationTransition: ContractUserModerationTransitionNAPI;
    constructor(ownerId: IdentifierLike, dataContractId: IdentifierLike, identityContractNonce: bigint, action: ContractUserModerationAction, userFeeIncrease?: number);
    get ownerId(): IdentifierWASM;
    set ownerId(value: IdentifierLike);
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    get identityContractNonce(): bigint;
    set identityContractNonce(value: bigint);
    get action(): ContractUserModerationAction;
    set action(value: ContractUserModerationAction);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): ContractUserModerationTransitionWASM;
    static createFromRawInstance(rawInstance: ContractUserModerationTransitionNAPI): ContractUserModerationTransitionWASM;
}
