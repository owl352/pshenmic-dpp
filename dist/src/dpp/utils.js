import { dppProvider } from './provider.js';
import { UINT32MAX } from './constants.js';
import { IdentifierWASM } from './structs/Identifier.js';
export function valueToDynamicValue(value) {
    if (typeof value === 'bigint' || (value > UINT32MAX && typeof value !== 'string')) {
        return dppProvider.dpp.DynamicValue.fromBigIntString(BigInt(value.toString()).toString());
    }
    else if (value instanceof IdentifierWASM || value instanceof dppProvider.dpp.IdentifierNAPI) {
        return new dppProvider.dpp.DynamicValue(value.bytes());
    }
    else if (value instanceof Uint8Array) {
        return new dppProvider.dpp.DynamicValue(value);
    }
    else if (Array.isArray(value)) {
        return new dppProvider.dpp.DynamicValue(value.map(valueToDynamicValue));
    }
    else if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        const objectWithDynamicValue = Object.assign({}, value);
        for (const key of keys) {
            objectWithDynamicValue[key] = valueToDynamicValue(value[key]);
        }
        return new dppProvider.dpp.DynamicValue(objectWithDynamicValue);
    }
    else if (typeof value === 'function') {
        throw new Error('Cannot parse value from function');
    }
    if (typeof value === 'number') {
        // we cannot strongly pass uint or float without js layer check
        if (Number.isInteger(value)) {
            if (value > 4294967295 || value < 0) {
                return dppProvider.dpp.DynamicValue.fromInt(value);
            }
            else {
                return dppProvider.dpp.DynamicValue.fromUInt(value);
            }
        }
        else {
            return dppProvider.dpp.DynamicValue.fromFloat(value);
        }
    }
    else {
        return new dppProvider.dpp.DynamicValue(value);
    }
}
export function valueFromDynamicValue(dynamicValue) {
    if (dynamicValue.value instanceof dppProvider.dpp.DynamicValue) {
        return valueToDynamicValue(dynamicValue.value);
    }
    else if (dynamicValue.isBigInt()) {
        return BigInt(dynamicValue.value);
    }
    else if (Array.isArray(dynamicValue.value)) {
        return dynamicValue.value.map(valueFromDynamicValue);
    }
    else if (typeof dynamicValue.value === 'object' && !(dynamicValue.value instanceof Uint8Array) && dynamicValue.value !== null) {
        const obj = {};
        const keys = Object.keys(dynamicValue.value);
        for (const key of keys) {
            obj[key] = valueFromDynamicValue(dynamicValue.value[key]);
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
