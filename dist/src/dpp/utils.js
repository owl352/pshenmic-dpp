import { dppProvider } from './provider.js';
import { UINT32MAX } from './constants.js';
import { IdentifierWASM } from './structs/Identifier.js';
import { PlatformAddressWASM } from './structs/PlatformAddress/PlatformAddress.js';
export function valueToDynamicValue(value) {
    return wrapDynamicValue(value, dppProvider.dpp.DynamicValue, dppProvider.dpp.IdentifierNAPI);
}
/**
 * Same conversion as valueToDynamicValue, but wraps with the SHIELDED
 * (pshenmic-orchard) instance's DynamicValue. Wrapped napi objects cannot
 * cross the base <-> shielded instance boundary, so arguments destined for
 * orchard methods (scope, network) must be wrapped by orchard's own
 * DynamicValue — ported with the identical JS surface for exactly this.
 */
export function valueToShieldedDynamicValue(value) {
    return wrapDynamicValue(value, dppProvider.shielded.DynamicValue);
}
function wrapDynamicValue(value, Ctor, IdentifierNAPI) {
    if (typeof value === 'bigint' || (value > UINT32MAX && typeof value !== 'string')) {
        return Ctor.fromBigIntString(BigInt(value.toString()).toString());
    }
    else if (value instanceof IdentifierWASM || (IdentifierNAPI != null && value instanceof IdentifierNAPI)) {
        return new Ctor(value.bytes());
    }
    else if (value instanceof Uint8Array) {
        return new Ctor(value);
    }
    else if (Array.isArray(value)) {
        return new Ctor(value.map(v => wrapDynamicValue(v, Ctor, IdentifierNAPI)));
    }
    else if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        const objectWithDynamicValue = Object.assign({}, value);
        for (const key of keys) {
            objectWithDynamicValue[key] = wrapDynamicValue(value[key], Ctor, IdentifierNAPI);
        }
        return new Ctor(objectWithDynamicValue);
    }
    else if (typeof value === 'function') {
        throw new Error('Cannot parse value from function');
    }
    if (typeof value === 'number') {
        // we cannot strongly pass uint or float without js layer check
        if (Number.isInteger(value)) {
            if (value > 4294967295 || value < 0) {
                return Ctor.fromInt(value);
            }
            else {
                return Ctor.fromUInt(value);
            }
        }
        else {
            return Ctor.fromFloat(value);
        }
    }
    else {
        return new Ctor(value);
    }
}
export function valueFromDynamicValue(dynamicValue, jsonLike = false) {
    if (dynamicValue.value instanceof dppProvider.dpp.DynamicValue) {
        return valueFromDynamicValue(dynamicValue.value, jsonLike);
    }
    else if (dynamicValue.isBigInt()) {
        const num = BigInt(dynamicValue.value);
        if (jsonLike && num < BigInt(Number.MAX_SAFE_INTEGER) && num > BigInt(Number.MIN_SAFE_INTEGER)) {
            return Number(dynamicValue.value);
        }
        else {
            return num;
        }
    }
    else if (Array.isArray(dynamicValue.value)) {
        return dynamicValue.value.map(v => valueFromDynamicValue(v, jsonLike));
    }
    else if (typeof dynamicValue.value === 'object' && !(dynamicValue.value instanceof Uint8Array) && dynamicValue.value !== null) {
        const obj = {};
        const keys = Object.keys(dynamicValue.value);
        for (const key of keys) {
            obj[key] = valueFromDynamicValue(dynamicValue.value[key], jsonLike);
        }
        return obj;
    }
    else {
        return dynamicValue.value;
    }
}
export function prepareIdentifierValue(identifier) {
    if (identifier instanceof IdentifierWASM) {
        return identifier._rawIdentifier;
    }
    else if (identifier instanceof dppProvider.dpp.IdentifierNAPI) {
        return identifier;
    }
    else {
        return new dppProvider.dpp.DynamicValue(identifier);
    }
}
export function preparePlatformAddressValue(address) {
    if (address instanceof PlatformAddressWASM) {
        return address._rawPlatformAddress;
    }
    else if (address instanceof dppProvider.dpp.PlatformAddressNAPI) {
        return address;
    }
    else {
        return new dppProvider.dpp.DynamicValue(address);
    }
}
const PLAIN_IDENTIFIER_KEYS = new Set(['identityId', 'documentId', 'actionId', 'reasonDocumentId', 'contractGroupId', 'admins']);
/**
 * Plain moderation / contract group objects carry identifiers as base58 strings or bytes:
 * the bindings decode them from bytes only, so identifier fields are turned into bytes here
 */
export function plainIdentifiersToBytes(value, isIdentifier = false) {
    if (isIdentifier && (typeof value === 'string' || value instanceof IdentifierWASM)) {
        return new IdentifierWASM(value).bytes();
    }
    else if (Array.isArray(value)) {
        return value.map(item => plainIdentifiersToBytes(item, isIdentifier));
    }
    else if (value != null && typeof value === 'object' && !(value instanceof Uint8Array)) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, plainIdentifiersToBytes(item, PLAIN_IDENTIFIER_KEYS.has(key))]));
    }
    return value;
}
const PROOF_IDENTIFIER_KEYS = new Set([
    'contractId', 'identityId', 'documentId', 'actionId', 'reasonDocumentId', 'contractGroupId',
    'contractGroupIds', 'moderatorId', 'documentOwnerId', 'claimantId', 'proposerId', 'owner',
    'singleOwner', 'admins'
]);
const PROOF_BIGINT_KEYS = new Set([
    'credits', 'balance', 'remainingBudget', 'creditsLeft', 'until', 'removedAt', 'restoredAt',
    'warnedAt', 'timeMs', 'proposedAt', 'documentLastModifiedAt', 'documentRevision', 'skipped',
    'count', 'sum', 'avgFixedPoint'
]);
function normalizeProofValue(value, key) {
    if (value instanceof Uint8Array) {
        return key != null && PROOF_IDENTIFIER_KEYS.has(key) ? new IdentifierWASM(value) : value;
    }
    else if (Array.isArray(value)) {
        return value.map(item => normalizeProofValue(item, key));
    }
    else if (value != null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, normalizeProofValue(item, childKey)]));
    }
    else if (key != null && PROOF_BIGINT_KEYS.has(key) && (typeof value === 'number' || typeof value === 'string')) {
        return BigInt(value);
    }
    return value;
}
/** A proven value without a dedicated class, with identifiers as IdentifierWASM and credits / timestamps as bigint **/
export function plainProofValue(dynamicValue) {
    return normalizeProofValue(valueFromDynamicValue(dynamicValue));
}
export function identifierFromBytes(bytes) {
    return new IdentifierWASM(bytes);
}
