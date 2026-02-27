import type { TokenEmergencyActionTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenEmergencyActionLike } from '../../../types.js';
export declare class TokenEmergencyActionTransitionWASM {
    /** @private **/
    _rawTransition: TokenEmergencyActionTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, emergencyAction: TokenEmergencyActionLike, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get emergencyAction(): string;
    set emergencyAction(value: TokenEmergencyActionLike);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    static createFromRawInstance(rawInstance: TokenEmergencyActionTransitionNAPI): TokenEmergencyActionTransitionWASM;
}
