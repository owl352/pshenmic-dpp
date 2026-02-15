import * as dpp from "../../pkg/src/wasm.js";
import {valueFromDynamicValue, valueToDynamicValue} from "../../pkg/src/dpp/utils.js"

describe('DynamicValue', () => {
  beforeAll(()=>{
    // in real scenarios we cannot call valueFromDynamicValue and valueToDynamicValue from outside of module
    // but tests use these methods and require to import dpp before run,
    // or we can set dpp manually via setDpp()
    dpp
  })

  describe('serialization / deserialization', function () {
    test('should allow to serialize and deserialize basic types', function () {
      const uint8ArrayValue = new Uint8Array([1, 2, 3, 4])
      const numberValue = 122
      const stringValue = 'bebra'
      const bigIntValue = BigInt('88888888888888888888')
      const boolValue = true
      const nullValue = null
      const undefinedValue = undefined
      const floatValue = 24.2000000000
      const intValue = -567

      const uint8ArrayDynamicValue = valueToDynamicValue(uint8ArrayValue)
      const numberDynamicValue = valueToDynamicValue(numberValue)
      const stringDynamicValue = valueToDynamicValue(stringValue)
      const bigIntDynamicValue = valueToDynamicValue(bigIntValue)
      const boolDynamicValue = valueToDynamicValue(boolValue)
      const nullDynamicValue = valueToDynamicValue(nullValue)
      const undefinedDynamicValue = valueToDynamicValue(undefinedValue)
      const floatDynamicValue = valueToDynamicValue(floatValue)
      const intDynamicValue = valueToDynamicValue(intValue)

      expect(uint8ArrayDynamicValue.value).toBeInstanceOf(Uint8Array)
      expect(numberDynamicValue.value).toStrictEqual(numberValue)
      expect(stringDynamicValue.value).toStrictEqual(stringValue)
      expect(bigIntDynamicValue.value).toStrictEqual(bigIntValue.toString())
      expect(boolDynamicValue.value).toStrictEqual(boolValue)
      expect(nullDynamicValue.value).toStrictEqual(nullValue)
      expect(undefinedDynamicValue.value).toStrictEqual(undefinedValue)
      expect(floatDynamicValue.value).toStrictEqual(floatValue)
      expect(intDynamicValue.value).toStrictEqual(intValue)

      expect(valueFromDynamicValue(uint8ArrayDynamicValue)).toBeInstanceOf(Uint8Array)
      expect(valueFromDynamicValue(numberDynamicValue)).toStrictEqual(numberValue)
      expect(valueFromDynamicValue(stringDynamicValue)).toStrictEqual(stringValue)
      expect(valueFromDynamicValue(bigIntDynamicValue)).toStrictEqual(bigIntValue)
      expect(valueFromDynamicValue(boolDynamicValue)).toStrictEqual(boolValue)
      expect(valueFromDynamicValue(nullDynamicValue)).toStrictEqual(nullValue)
      expect(valueFromDynamicValue(undefinedDynamicValue)).toStrictEqual(undefinedValue)
      expect(valueFromDynamicValue(floatDynamicValue)).toStrictEqual(floatValue)
      expect(valueFromDynamicValue(intDynamicValue)).toStrictEqual(intValue)
    })

    test('should allow to serialize and deserialize object and array', function () {
      const defaultObjectValue = {
        0: 0,
        1: 3,
        2: "string",
        3: false
      }
      const extendedObjectValue = {
        a: 1,
        b: false,
        c: new Uint8Array([1, 2, 3, 45]),
        v: BigInt('1111'),
        e: {
          bebra: "here",
        }
      }

      const defaultArrayValue = [1, 2, 'b', true]
      const extendedArrayValue = [1, extendedObjectValue]

      const defaultObjectDynamicValue = valueToDynamicValue(defaultObjectValue)
      const extendedObjectDynamicValue = valueToDynamicValue(extendedObjectValue)
      const defaultArrayDynamicValue = valueToDynamicValue(defaultArrayValue)
      const extendedArrayDynamicValue = valueToDynamicValue(extendedArrayValue)

      expect(valueFromDynamicValue(defaultObjectDynamicValue)).toStrictEqual(defaultObjectValue)
      expect(valueFromDynamicValue(extendedObjectDynamicValue)).toStrictEqual(extendedObjectValue)
      expect(valueFromDynamicValue(defaultArrayDynamicValue)).toStrictEqual(defaultArrayValue)
      expect(valueFromDynamicValue(extendedArrayDynamicValue)).toStrictEqual(extendedArrayValue)
    })
  })
})
