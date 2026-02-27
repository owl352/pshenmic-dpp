import type { IdentityCreditTransferNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityCreditTransferWASM {
    /** @private **/
    _rawIdentityCreditTransfer: IdentityCreditTransferNAPI;
    constructor(sender: IdentifierLike, amount: bigint, recipient: IdentifierLike, nonce: bigint, userFeeIncrease?: number);
    get recipientId(): IdentifierWASM;
    set recipientId(value: IdentifierLike);
    get senderId(): IdentifierWASM;
    set senderId(value: IdentifierLike);
    get amount(): bigint;
    set amount(value: bigint);
    get nonce(): bigint;
    set nonce(value: bigint);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    getSignableBytes(): Uint8Array;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityCreditTransferWASM;
    static fromHex(hex: string): IdentityCreditTransferWASM;
    static fromBase64(base64: string): IdentityCreditTransferWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityCreditTransferWASM;
    static createFromRawInstance(rawInstance: IdentityCreditTransferNAPI): IdentityCreditTransferWASM;
}
