import { UINT16MAX, UINT32MAX, UINT8MAX } from './constants.js';
export function valueToDynamicEnum(value) {
    if (typeof value === 'string') {
        return {
            type: 'Text',
            field0: value
        };
    }
    else if (typeof value === 'number') {
        let numType;
        if (value <= UINT8MAX) {
            numType = 'Uint8';
        }
        else if (value <= UINT16MAX) {
            numType = 'Uint16';
        }
        else if (value <= UINT32MAX) {
            numType = 'Uint32';
        }
        else {
            throw new Error(`out of range ${value}`);
        }
        return {
            type: numType,
            field0: value
        };
    }
    else if (value === undefined || value === null) {
        return {
            type: 'Null',
            field0: null
        };
    }
    else {
        throw new Error(`${String(value)} is not a number or string`);
    }
}
