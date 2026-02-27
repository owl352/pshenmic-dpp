import type { AuthorizedActionTakersNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class AuthorizedActionTakersWASM {
    /** @private **/
    _rawAuthorizedActionTakers: AuthorizedActionTakersNAPI;
    private constructor();
    getTakerType(): string;
    getValue(): undefined | IdentifierWASM | number;
    static NoOne(): AuthorizedActionTakersWASM;
    static ContractOwner(): AuthorizedActionTakersWASM;
    static Identity(id: IdentifierLike): AuthorizedActionTakersWASM;
    static MainGroup(): AuthorizedActionTakersWASM;
    static Group(groupContractPosition: number): AuthorizedActionTakersWASM;
    static createFromRawInstance(rawInstance: AuthorizedActionTakersNAPI): AuthorizedActionTakersWASM;
}
