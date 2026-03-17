import * as dpp from "pshenmic-dpp";
import {valueFromDynamicValue, valueToDynamicValue} from "pshenmic-dpp/wasm/utils"

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

  describe('number values in object', function () {
    const mock = {
      uint: 1999,
      int: -293,
      float: 2222.11231,
      smallBigInt: BigInt(2),
      bigBigInt: BigInt(2000000000000),
      stringUint: '11',
      stringInt: '-11',
      stringFloat: '11.2',
      bigStringNumber: '11111111111111111111111111111111'
    }

    const dynValue = valueToDynamicValue(mock)

    const result = valueFromDynamicValue(dynValue)

    expect(valueFromDynamicValue(dynValue)).toStrictEqual(mock)
    expect(dynValue.value.uint.getType()).toStrictEqual('u32')
    expect(dynValue.value.int.getType()).toStrictEqual('i64')
    expect(dynValue.value.float.getType()).toStrictEqual('f64')
    expect(dynValue.value.smallBigInt.getType()).toStrictEqual('BigIntString')
    expect(dynValue.value.bigBigInt.getType()).toStrictEqual('BigIntString')
    expect(dynValue.value.stringUint.getType()).toStrictEqual('String')
    expect(dynValue.value.stringInt.getType()).toStrictEqual('String')
    expect(dynValue.value.stringFloat.getType()).toStrictEqual('String')
  })

  describe('should decode document from state transition in jsonLike', function () {
    const stateTransition = dpp.StateTransitionWASM.fromBase64('AgHv88sfWzscuW2Ob/0v5d+EgqmWG7ZIvlQG7mHWBH7z9gEAAAAB7JH7W+JkM0Vne2U1zlWYVeQNzRPTpdiWRfsgfwNS2UoCCGJsb2dQb3N0KBdMgeznVQ1smUXVFNPfE2PC379wpWVH8cdu2ilzeI0Ah/i2xfrKCm5ACQAbEQkSc+GRUkdLor4Eu7Vzf6oRc9UHBmJsb2dJZAogdhC4nVm3ufPCgdfoOKXtnhqwg7O3axyTS9WB3EFvNBYPY29tbWVudHNFbmFibGVkEwEHY29udGVudAr7AUh4nM2TTWrDMBCFrxK0jkCyJMvqLnRV6A1KFhpplJgotrEVaAi+e8clpdBuvCnNcn7ezPvQ6O3G2siemKgNSGETT8ZarhUm7hpX8yStEpVCk6xlW1auA1L34Ed/GP1wpNQw9sPEnm6s4Ht57nM/UkPE5C+5UBl8OB3G/tLF37VFscvtoTtjV6iSMRU2b1nou/KZIXf3jUvrXUHRrosbv8ltKRk30JbNl2LLpnLNuPiZ5z1NOrY5jtjRqP28vbM656zTleagJHCNXnIQiUIpgozGg2/0N2s4Yji9tlN5KXj+A97FJG1AcpZ8nnANv1wHGo22ASrFXQDJde0SBzDIdQBVRQEoDDw2aLUONPkKtfF0s9bR9bqGkJW3PNYCg/FOgIqPDarWgQrRxKapBXdCJ3pR7TjUVnJrpAo6yhSc/4dv+tPu/gNBt2qtC3B1Ymxpc2hlZEF0Av0AAAGcptJlIwRzbHVnEhV0aGlzLWlzLW15LWZpcnN0LXBvc3QIc3VidGl0bGUSD1dpdGggYSBzdWJ0aXRsZQV0aXRsZRIVVGhpcyBpcyBteSBmaXJzdCBwb3N0AAABQR+H40MbUEmFXQbTPcwy9vMD8EiTwDzMpW3YIkfSIDvHij5ZIAVvqm0ZJScJzKV7EnRUi/f1tZ/wFJfd1+LDtpps')

    const batch = dpp.BatchTransitionWASM.fromStateTransition(stateTransition)

    const transition = batch.transitions[0].toTransition() as dpp.DocumentTransitionWASM

    const publishedAt = transition.createTransition.data.publishedAt

    expect(typeof publishedAt).toEqual('number')
  })
})
