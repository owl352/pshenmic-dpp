import type { DataContractUpdateTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { DataContractWASM } from '../DataContract.js';
import { PlatformVersionLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class DataContractUpdateTransitionWASM {
    /** @private **/
    _rawDataContractUpdateTransition: DataContractUpdateTransitionNAPI;
    constructor(dataContract: DataContractWASM, identityNonce: bigint, platformVersion?: PlatformVersionLike);
    get featureVersion(): number;
    get identityContractNonce(): bigint;
    verifyProtocolVersion(protocolVersion: number): boolean;
    setDataContract(dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): void;
    getDataContract(fullValidation?: boolean, platformVersion?: PlatformVersionLike): DataContractWASM;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): DataContractUpdateTransitionWASM;
    static fromHex(hex: string): DataContractUpdateTransitionWASM;
    static fromBase64(base64: string): DataContractUpdateTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): DataContractUpdateTransitionWASM;
    static createFromRawInstance(rawInstance: DataContractUpdateTransitionNAPI): DataContractUpdateTransitionWASM;
}
