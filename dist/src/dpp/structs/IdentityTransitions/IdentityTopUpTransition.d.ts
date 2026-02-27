import type { IdentityTopUpTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityTopUpTransitionWASM {
    /** @private **/
    _rawIdentityTopUpTransition: IdentityTopUpTransitionNAPI;
    constructor(assetLockProof: AssetLockProofWASM, identityId: IdentifierLike, userFeeIncrease?: number);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get identityIdentifier(): IdentifierWASM;
    set identityIdentifier(id: IdentifierLike);
    get assetLockProof(): AssetLockProofWASM;
    set assetLockProof(value: AssetLockProofWASM);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    getSignableBytes(): Uint8Array;
    getModifiedDataIds(): IdentifierWASM[];
    getOptionalAssetLockProof(): AssetLockProofWASM | undefined;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityTopUpTransitionWASM;
    static fromHex(hex: string): IdentityTopUpTransitionWASM;
    static fromBase64(base64: string): IdentityTopUpTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityTopUpTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityTopUpTransitionNAPI): IdentityTopUpTransitionWASM;
}
