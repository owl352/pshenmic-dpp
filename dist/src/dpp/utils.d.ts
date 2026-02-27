import type { DynamicValue, IdentifierLikeNAPI } from '../../binaries/bindingsTypes.js';
import { IdentifierLike } from './types.js';
export declare function valueToDynamicValue(value: any): DynamicValue;
export declare function valueFromDynamicValue(dynamicValue: DynamicValue): any;
export declare function prepareIdentifierValue(identifier: IdentifierLike): IdentifierLikeNAPI;
