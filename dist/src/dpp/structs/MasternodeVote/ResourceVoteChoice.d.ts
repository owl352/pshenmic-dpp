import type { ResourceVoteChoiceNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class ResourceVoteChoiceWASM {
    /** @private **/
    _rawResourceVoteChoice: ResourceVoteChoiceNAPI;
    private constructor();
    getValue(): IdentifierWASM | undefined;
    getType(): string;
    static TowardsIdentity(id: IdentifierLike): ResourceVoteChoiceWASM;
    static Abstain(): ResourceVoteChoiceWASM;
    static Lock(): ResourceVoteChoiceWASM;
    static createFromRawInstance(rawInstance: ResourceVoteChoiceNAPI): ResourceVoteChoiceWASM;
}
