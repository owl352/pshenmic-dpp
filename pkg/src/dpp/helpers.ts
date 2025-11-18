import { UINT16MAX, UINT32MAX, UINT8MAX } from './constants.js'
import { EnumLike } from '../types.js'
import { DynamicValue } from '../../binaries/bindingsTypes.js'

export function valueToDynamicEnum (value?: EnumLike): DynamicValue {
  if (typeof value === 'string') {
    return {
      type: 'Text',
      field0: value
    }
  } else if (typeof value === 'number') {
    let numType: 'Uint8' | 'Uint16' | 'Uint32'

    if (value <= UINT8MAX) {
      numType = 'Uint8'
    } else if (value <= UINT16MAX) {
      numType = 'Uint16'
    } else if (value <= UINT32MAX) {
      numType = 'Uint32'
    } else {
      throw new Error(`out of range ${value}`)
    }

    return {
      type: numType,
      field0: value as number
    }
  } else if (value === undefined || value === null) {
    return {
      type: 'Null',
      field0: null
    }
  } else {
    throw new Error(`${String(value)} is not a number or string`)
  }
}
