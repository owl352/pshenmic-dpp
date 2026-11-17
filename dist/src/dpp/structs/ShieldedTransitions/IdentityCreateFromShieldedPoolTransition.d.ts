import type { PlatformVersionNAPI, IdentityCreateFromShieldedPoolTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { IdentifierWASM } from '../Identifier.js';
import { IdentifierLike, PlatformAddressLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityCreateFromShieldedPoolTransitionWASM {
    /** @private **/
    _rawIdentityCreateFromShieldedPoolTransition: IdentityCreateFromShieldedPoolTransitionNAPI;
    constructor(publicKeys: IdentityPublicKeyInCreationWASM[], denomination: bigint, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array, sendToAddressOnCreationFailure: PlatformAddressLike, identityId: IdentifierLike);
    get publicKeys(): IdentityPublicKeyInCreationWASM[];
    set publicKeys(value: IdentityPublicKeyInCreationWASM[]);
    get denomination(): bigint;
    set denomination(value: bigint);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    get sendToAddressOnCreationFailure(): PlatformAddressWASM;
    set sendToAddressOnCreationFailure(value: PlatformAddressLike);
    get identityId(): IdentifierWASM;
    set identityId(value: IdentifierLike);
    static computeMinimumFee(numActions: number, numKeys: number, platformVersion?: PlatformVersionNAPI): bigint;
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): IdentityCreateFromShieldedPoolTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityCreateFromShieldedPoolTransitionNAPI): IdentityCreateFromShieldedPoolTransitionWASM;
}
