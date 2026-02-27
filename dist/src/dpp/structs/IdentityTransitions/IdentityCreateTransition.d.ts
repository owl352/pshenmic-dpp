import type { IdentityCreateTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { PlatformVersionLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityCreateTransitionWASM {
    /** @private **/
    _rawIdentityCreateTransition: IdentityCreateTransitionNAPI;
    constructor(publicKeys: IdentityPublicKeyInCreationWASM[], assetLockProof: AssetLockProofWASM, signature?: Uint8Array, userFeeIncrease?: number);
    get publicKeys(): IdentityPublicKeyInCreationWASM[];
    set publicKeys(publicKeys: IdentityPublicKeyInCreationWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    get assetLock(): AssetLockProofWASM;
    set assetLock(value: AssetLockProofWASM);
    getSignableBytes(): Uint8Array;
    getIdentifier(): IdentifierWASM;
    bytes(): Uint8Array;
    toStateTransition(): StateTransitionWASM;
    static default(platformVersion: PlatformVersionLike): IdentityCreateTransitionWASM;
    static fromHex(hex: string): IdentityCreateTransitionWASM;
    static fromBase64(base64: string): IdentityCreateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityCreateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityCreateTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityCreateTransitionNAPI): IdentityCreateTransitionWASM;
}
