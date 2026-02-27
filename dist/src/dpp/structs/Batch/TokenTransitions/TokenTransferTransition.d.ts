import type { TokenTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { IdentifierLike } from '../../../types.js';
import { SharedEncryptedNoteWASM } from '../../EncryptedNote/SharedEncryptedNote.js';
import { PrivateEncryptedNoteWASM } from '../../EncryptedNote/PrivateEncryptedNote.js';
import { IdentifierWASM } from '../../Identifier.js';
export declare class TokenTransferTransitionWASM {
    /** @private **/
    _rawTransition: TokenTransferTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, recipientId: IdentifierLike, amount: bigint, publicNote?: string, sharedEncryptedNote?: SharedEncryptedNoteWASM, privateEncryptedNote?: PrivateEncryptedNoteWASM);
    get recipientId(): IdentifierWASM;
    set recipientId(value: IdentifierLike);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get amount(): bigint;
    set amount(value: bigint);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    get sharedEncryptedNote(): SharedEncryptedNoteWASM | undefined;
    set sharedEncryptedNote(value: SharedEncryptedNoteWASM | undefined);
    get privateEncryptedNote(): PrivateEncryptedNoteWASM | undefined;
    set privateEncryptedNote(value: PrivateEncryptedNoteWASM | undefined);
    static createFromRawInstance(rawInstance: TokenTransferTransitionNAPI): TokenTransferTransitionWASM;
}
