import type { DataContractCreateTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { DataContractWASM } from '../DataContract.js';
import { PlatformVersionLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class DataContractCreateTransitionWASM {
    /** @private **/
    _rawDataContractCreateTransition: DataContractCreateTransitionNAPI;
    constructor(dataContract: DataContractWASM, identityNonce: bigint, platformVersion?: PlatformVersionLike);
    get featureVersion(): number;
    get identityNonce(): bigint;
    verifyProtocolVersion(protocolVersion: number): boolean;
    setDataContract(dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): void;
    getDataContract(platformVersion?: PlatformVersionLike, fullValidation?: boolean): DataContractWASM;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): DataContractCreateTransitionWASM;
    static fromHex(hex: string): DataContractCreateTransitionWASM;
    static fromBase64(base64: string): DataContractCreateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): DataContractCreateTransitionWASM;
    static createFromRawInstance(rawInstance: DataContractCreateTransitionNAPI): DataContractCreateTransitionWASM;
}
