import type { IdentityPublicKeyInCreationNAPI } from '../../../binaries/bindingsTypes.js';
import { KeyTypeLike, NetworkLike, PurposeLike, SecurityLevelLike } from '../types.js';
import { ContractBoundsWASM } from './ContractBounds.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { PrivateKeyWASM } from './PrivateKey.js';
export declare class IdentityPublicKeyInCreationWASM {
    /** @private **/
    _rawKeyInCreation: IdentityPublicKeyInCreationNAPI;
    constructor(id: number, purpose: PurposeLike, securityLevel: SecurityLevelLike, keyType: KeyTypeLike, readOnly: boolean, binaryData: Uint8Array, signature?: Uint8Array, contractBounds?: ContractBoundsWASM);
    toIdentityPublicKey(): IdentityPublicKeyWASM;
    validatePrivateKey(privateKey: string | Uint8Array | PrivateKeyWASM, network: NetworkLike): boolean;
    getHash(): Uint8Array;
    getContractBounds(): ContractBoundsWASM | undefined;
    get contractBounds(): ContractBoundsWASM | undefined;
    set contractBounds(value: ContractBoundsWASM);
    get keyId(): number;
    set keyId(value: number);
    get purpose(): string;
    set purpose(value: PurposeLike);
    get securityLevel(): string;
    set securityLevel(value: SecurityLevelLike);
    get keyType(): string;
    set keyType(value: KeyTypeLike);
    get readOnly(): boolean;
    set readOnly(value: boolean);
    get data(): Uint8Array;
    set data(value: Uint8Array);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    static createFromRawInstance(rawInstance: IdentityPublicKeyInCreationNAPI): IdentityPublicKeyInCreationWASM;
}
