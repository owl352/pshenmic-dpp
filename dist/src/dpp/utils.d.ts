import type { DynamicValue, IdentifierLikeNAPI, PlatformAddressLikeNAPI } from '../../binaries/bindingsTypes.js';
import { IdentifierLike, PlatformAddressLike } from './types.js';
import { IdentifierWASM } from './structs/Identifier.js';
export declare function valueToDynamicValue(value: any): DynamicValue;
/**
 * Same conversion as valueToDynamicValue, but wraps with the SHIELDED
 * (pshenmic-orchard) instance's DynamicValue. Wrapped napi objects cannot
 * cross the base <-> shielded instance boundary, so arguments destined for
 * orchard methods (scope, network) must be wrapped by orchard's own
 * DynamicValue — ported with the identical JS surface for exactly this.
 */
export declare function valueToShieldedDynamicValue(value: any): DynamicValue;
export declare function valueFromDynamicValue(dynamicValue: DynamicValue, jsonLike?: boolean): any;
export declare function prepareIdentifierValue(identifier: IdentifierLike): IdentifierLikeNAPI;
export declare function preparePlatformAddressValue(address: PlatformAddressLike): PlatformAddressLikeNAPI;
/**
 * Plain moderation / contract group objects carry identifiers as base58 strings or bytes:
 * the bindings decode them from bytes only, so identifier fields are turned into bytes here
 */
export declare function plainIdentifiersToBytes(value: any, isIdentifier?: boolean): any;
/** A proven value without a dedicated class, with identifiers as IdentifierWASM and credits / timestamps as bigint **/
export declare function plainProofValue(dynamicValue: DynamicValue): any;
export declare function identifierFromBytes(bytes: Uint8Array): IdentifierWASM;
