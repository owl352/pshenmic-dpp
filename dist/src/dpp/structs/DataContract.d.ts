import type { DataContractNAPI } from '../../../binaries/bindingsTypes.js';
import { DataContractGroups, DataContractTokens, IdentifierLike, PlatformVersionLike } from '../types.js';
import { IdentifierWASM } from './Identifier.js';
export declare class DataContractWASM {
    /** @private **/
    _rawDataContract: DataContractNAPI;
    constructor(ownerId: IdentifierLike, identityNonce: bigint, schema?: object, definitions?: object, tokens?: DataContractTokens[], fullValidation?: boolean, platformVersion?: PlatformVersionLike);
    get systemVersion(): number;
    set systemVersion(value: number);
    get version(): number;
    set version(value: number);
    get id(): IdentifierWASM;
    set id(value: IdentifierLike);
    get ownerId(): IdentifierWASM;
    set ownerId(value: IdentifierLike);
    get tokens(): DataContractTokens[];
    set tokens(tokens: DataContractTokens[]);
    get groups(): DataContractGroups[];
    set groups(groups: DataContractGroups[]);
    get description(): string | undefined;
    set description(value: string | undefined);
    get keywords(): string[];
    set keywords(value: string[]);
    getSchemas(): object;
    getConfig(): object;
    setConfig(value: object, platformVersion?: PlatformVersionLike): void;
    bytes(platformVersion: PlatformVersionLike): Uint8Array;
    hex(platformVersion: PlatformVersionLike): string;
    base64(platformVersion: PlatformVersionLike): string;
    toJSON(platformVersion: PlatformVersionLike): object;
    toValue(platformVersion: PlatformVersionLike): object;
    static fromValue(value: object, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM;
    static fromBytes(bytes: Uint8Array, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM;
    static fromHex(hex: string, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM;
    static fromBase64(base64: string, fullValidation: boolean, platformVersion?: PlatformVersionLike): DataContractWASM;
    static generateId(ownerId: IdentifierLike, identityNonce: bigint): IdentifierWASM;
    static createFromRawInstance(rawInstance: DataContractNAPI): DataContractWASM;
}
