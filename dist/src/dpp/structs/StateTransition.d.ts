import type { StateTransitionNAPI } from '../../../binaries/bindingsTypes.js';
import { PrivateKeyWASM } from './PrivateKey.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { IdentifierLike, KeyTypeLike, PurposeLike } from '../types.js';
import { IdentifierWASM } from './Identifier.js';
export declare class StateTransitionWASM {
    /** @private **/
    _rawStateTransition: StateTransitionNAPI;
    private constructor();
    get signature(): Uint8Array | undefined;
    set signature(signature: Uint8Array);
    get signaturePublicKeyId(): number | undefined;
    set signaturePublicKeyId(keyId: number);
    get userFeeIncrease(): number;
    set userFeeIncrease(userFeeIncrease: number);
    sign(privateKey: PrivateKeyWASM | string | Uint8Array, publicKey: IdentityPublicKeyWASM): Uint8Array;
    signByPrivateKey(privateKey: PrivateKeyWASM | string | Uint8Array, keyId?: number, keyType?: KeyTypeLike): Uint8Array;
    verifyPublicKey(publicKey: IdentityPublicKeyWASM, allowSigningWithAnySecurityLevel?: boolean, allowSigningWithAnyPurpose?: boolean): void;
    hash(skipSignature: boolean): string;
    getActionName(): string;
    getActionType(): string;
    getActionTypeNumber(): number;
    getOwnerId(): IdentifierWASM | undefined;
    getPurposeRequirement(): string[] | undefined;
    getKeyLevelRequirement(purpose: PurposeLike): string[] | undefined;
    getIdentityContractNonce(): bigint | undefined;
    getIdentityNonce(): bigint | undefined;
    setOwnerId(ownerId: IdentifierLike): void;
    setIdentityContractNonce(nonce: bigint): void;
    setIdentityNonce(nonce: bigint): void;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    static fromBytes(bytes: Uint8Array): StateTransitionWASM;
    static fromHex(hex: string): StateTransitionWASM;
    static fromBase64(base64: string): StateTransitionWASM;
    static createFromRawInstance(instance: StateTransitionNAPI): StateTransitionWASM;
}
