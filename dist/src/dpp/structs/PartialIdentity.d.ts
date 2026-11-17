import type { PartialIdentityNAPI } from '../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../types.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { IdentifierWASM } from './Identifier.js';
export declare class PartialIdentityWASM {
    /** @private **/
    _rawPartialIdentity: PartialIdentityNAPI;
    constructor(id: IdentifierLike, loadedPublicKeys: {
        [key: number]: IdentityPublicKeyWASM;
    }, balance?: bigint, revision?: bigint, notFoundPublicKeys?: number[]);
    get id(): IdentifierWASM;
    set id(id: IdentifierLike);
    get loadedPublicKeys(): {
        [key: number]: IdentityPublicKeyWASM;
    };
    set loadedPublicKeys(loadedPublicKeys: {
        [key: number]: IdentityPublicKeyWASM;
    });
    get balance(): bigint | undefined;
    set balance(balance: bigint | undefined | null);
    get revision(): bigint | undefined;
    set revision(revision: bigint | undefined | null);
    get notFoundPublicKeys(): number[];
    set notFoundPublicKeys(keys: number[]);
    static createFromRawInstance(rawInstance: PartialIdentityNAPI): PartialIdentityWASM;
}
