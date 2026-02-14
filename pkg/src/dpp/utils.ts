import {BigIntString, DynamicValue} from "../../binaries/bindingsTypes.js";
import {dppProvider} from "./provider.js";
import {UINT32MAX} from "./constants.js";

export function valueToDynamicValue(value: any): DynamicValue {
  if (typeof value === 'bigint' || value > UINT32MAX) {
    return dppProvider.dpp.DynamicValue.fromBigIntString(BigInt(value.toString() as BigIntString).toString())
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
    throw new Error("Cannot parse value from function")
  } else {
    return new dppProvider.dpp.DynamicValue(value)
  }
}

export function valueFromDynamicValue(dynamicValue: DynamicValue): any {
  if (dynamicValue.value instanceof dppProvider.dpp.DynamicValue) {
    return valueToDynamicValue(dynamicValue.value)
  } else if (dynamicValue.isBigInt()) {
    return BigInt(dynamicValue.value)
  } else if (Array.isArray(dynamicValue.value)) {
    return dynamicValue.value.map(valueFromDynamicValue)
  } else if (typeof dynamicValue.value === 'object' && !(dynamicValue.value instanceof Uint8Array) && dynamicValue.value !== null) {
    const obj: { [key: string]: any } = {}

    const keys: string[] = Object.keys(dynamicValue.value)

    for (const key of keys) {
      obj[key] = valueFromDynamicValue(dynamicValue.value[key])
    }

    return obj
  } else {
    return dynamicValue.value
  }
}
