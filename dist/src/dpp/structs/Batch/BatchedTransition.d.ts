import type { BatchedTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { TokenTransitionWASM } from './TokenTransition.js';
import { DocumentTransitionWASM } from './DocumentTransition.js';
import { IdentifierWASM } from '../Identifier.js';
import { IdentifierLike } from '../../types.js';
export declare class BatchedTransitionWASM {
    /** @private **/
    _rawTransition: BatchedTransitionNAPI;
    constructor(transition: TokenTransitionWASM | DocumentTransitionWASM);
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    toTransition(): DocumentTransitionWASM | TokenTransitionWASM;
    static createFromRawInstance(rawInstance: BatchedTransitionNAPI): BatchedTransitionWASM;
}
