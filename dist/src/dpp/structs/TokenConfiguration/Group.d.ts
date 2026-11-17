import type { GroupNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
export declare class GroupWASM {
    /** @private **/
    _rawGroup: GroupNAPI;
    constructor(members: {
        [key: string]: number;
    }, requiredPower: number);
    get members(): {
        [key: string]: number;
    };
    set members(members: {
        [key: string]: number;
    });
    get requiredPower(): number;
    set requiredPower(value: number);
    setMemberRequiredPower(member: IdentifierLike, power: number): void;
    static createFromRawInstance(rawInstance: GroupNAPI): GroupWASM;
}
