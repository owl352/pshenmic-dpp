import type { VotePollNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class VotePollWASM {
    /** @private **/
    _rawVotePollWASM: VotePollNAPI;
    constructor(contractId: IdentifierLike, documentTypeName: string, indexName: string, indexValues: string[]);
    get contractId(): IdentifierWASM;
    set contractId(value: IdentifierLike);
    get documentTypeName(): string;
    set documentTypeName(value: string);
    get indexName(): string;
    set indexName(value: string);
    get indexValues(): string[];
    set indexValues(values: string[]);
    toString(): string;
    static createFromRawInstance(rawInstance: VotePollNAPI): VotePollWASM;
}
