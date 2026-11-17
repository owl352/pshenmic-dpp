import type { DataContractCreateTransitionNAPI, PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js';
import { DataContractWASM } from '../DataContract.js';
import { ContractGroupMembership, ContractGroupRegistration, PlatformVersionLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class DataContractCreateTransitionWASM {
    /** @private **/
    _rawDataContractCreateTransition: DataContractCreateTransitionNAPI;
    constructor(dataContract: DataContractWASM, identityNonce: bigint, platformVersion?: PlatformVersionLike);
    get featureVersion(): number;
    get contractGroup(): ContractGroupRegistration | undefined;
    /** Registering a contract group turns the transition into V1 (platform v14+) **/
    set contractGroup(value: ContractGroupRegistration | undefined | null);
    /** The id of the group this transition registers **/
    get contractGroupId(): IdentifierWASM | undefined;
    get contractGroupMemberships(): ContractGroupMembership[];
    set contractGroupMemberships(value: ContractGroupMembership[]);
    get identityNonce(): bigint;
    verifyProtocolVersion(protocolVersion: number): boolean;
    setDataContract(dataContract: DataContractWASM, platformVersion?: PlatformVersionLike): void;
    getDataContract(platformVersion?: PlatformVersionLike, fullValidation?: boolean): DataContractWASM;
    calculateMinRequiredFee(platformVersion?: PlatformVersionNAPI): bigint;
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
