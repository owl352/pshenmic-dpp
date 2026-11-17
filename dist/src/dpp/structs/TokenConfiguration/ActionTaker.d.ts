import type { ActionTakerNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class ActionTakerWASM {
    /** @private **/
    _rawActionTaker: ActionTakerNAPI;
    constructor(value: IdentifierLike | IdentifierLike[]);
    getType(): string;
    get value(): IdentifierWASM | IdentifierWASM[];
    set value(value: IdentifierLike | IdentifierLike[]);
    static createFromRawInstance(rawInstance: ActionTakerNAPI): ActionTakerWASM;
}
