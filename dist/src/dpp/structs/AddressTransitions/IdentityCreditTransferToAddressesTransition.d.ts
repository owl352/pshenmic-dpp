import type { IdentityCreditTransferToAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityCreditTransferToAddressesTransitionWASM {
    /** @private **/
    _rawIdentityCreditTransferToAddressesTransition: IdentityCreditTransferToAddressesTransitionNAPI;
    constructor(identifier: IdentifierLike, recipients: OutputAddressWASM[], nonce: bigint, userFeeIncrease: number);
    get identityId(): IdentifierWASM;
    set identityId(id: IdentifierLike);
    get recipientAddresses(): OutputAddressWASM[];
    set recipientAddresses(value: OutputAddressWASM[]);
    get nonce(): bigint;
    set nonce(value: bigint);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signaturePublicKeyId(): number;
    set signaturePublicKeyId(value: number);
    get signature(): Uint8Array;
    set signature(sig: Uint8Array);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityCreditTransferToAddressesTransitionWASM;
    static fromHex(hex: string): IdentityCreditTransferToAddressesTransitionWASM;
    static fromBase64(base64: string): IdentityCreditTransferToAddressesTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityCreditTransferToAddressesTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityCreditTransferToAddressesTransitionNAPI): IdentityCreditTransferToAddressesTransitionWASM;
}
