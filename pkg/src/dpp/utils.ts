import type { BigIntString, DynamicValue, IdentifierLikeNAPI } from '../../binaries/bindingsTypes.js'
import { dppProvider } from './provider.js'
import { UINT32MAX } from './constants.js'
import { IdentifierLike } from './types.js'
import { IdentifierWASM } from './structs/Identifier.js'

export function valueToDynamicValue (value: any): DynamicValue {
  if (typeof value === 'bigint' || (value > UINT32MAX && typeof value !== 'string')) {
    return dppProvider.dpp.DynamicValue.fromBigIntString(BigInt(value.toString() as BigIntString).toString())
  } else if (value instanceof IdentifierWASM || value instanceof dppProvider.dpp.IdentifierNAPI) {
    return new dppProvider.dpp.DynamicValue(value.bytes())
  } else if (value instanceof Uint8Array) {
    return new dppProvider.dpp.DynamicValue(value)
  } else if (Array.isArray(value)) {
    return new dppProvider.dpp.DynamicValue(value.map(valueToDynamicValue))
  } else if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value)
    const objectWithDynamicValue: { [key: string]: DynamicValue } = Object.assign({}, value)

    for (const key of keys) {
      objectWithDynamicValue[key] = valueToDynamicValue(value[key])
    }

    return new dppProvider.dpp.DynamicValue(objectWithDynamicValue)
  } else if (typeof value === 'function') {
    throw new Error('Cannot parse value from function')
  } if (typeof value === 'number') {
    // we cannot strongly pass uint or float without js layer check
    if (Number.isInteger(value)) {
      if (value > 4294967295 || value < 0) {
        return dppProvider.dpp.DynamicValue.fromInt(value)
      } else {
        return dppProvider.dpp.DynamicValue.fromUInt(value)
      }
    } else {
      return dppProvider.dpp.DynamicValue.fromFloat(value)
    }
  } else {
    return new dppProvider.dpp.DynamicValue(value)
  }
}

export function valueFromDynamicValue (dynamicValue: DynamicValue, jsonLike: boolean = false): any {
  if (dynamicValue.value instanceof dppProvider.dpp.DynamicValue) {
    return valueFromDynamicValue(dynamicValue.value, jsonLike)
  } else if (dynamicValue.isBigInt()) {
    const num = BigInt(dynamicValue.value)
    if (jsonLike && num < BigInt(Number.MAX_SAFE_INTEGER) && num > BigInt(Number.MIN_SAFE_INTEGER)) {
      return Number(dynamicValue.value)
    } else {
      return num
    }
  } else if (Array.isArray(dynamicValue.value)) {
    return dynamicValue.value.map(v => valueFromDynamicValue(v, jsonLike))
  } else if (typeof dynamicValue.value === 'object' && !(dynamicValue.value instanceof Uint8Array) && dynamicValue.value !== null) {
    const obj: { [key: string]: any } = {}

    const keys: string[] = Object.keys(dynamicValue.value)

    for (const key of keys) {
      obj[key] = valueFromDynamicValue(dynamicValue.value[key], jsonLike)
    }

    return obj
  } else {
    return dynamicValue.value
  }
}

export function prepareIdentifierValue (identifier: IdentifierLike): IdentifierLikeNAPI {
  if (identifier instanceof IdentifierWASM) {
    return identifier._rawIdentifier
  } else if (identifier instanceof dppProvider.dpp.IdentifierNAPI) {
    return identifier
  } else {
    return new dppProvider.dpp.DynamicValue(identifier)
  }
}
