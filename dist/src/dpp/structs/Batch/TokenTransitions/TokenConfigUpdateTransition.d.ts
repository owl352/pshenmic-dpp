import type { TokenConfigUpdateTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { TokenBaseTransitionWASM } from '../TokenBaseTransition.js';
import { TokenConfigurationChangeItemWASM } from '../../TokenConfiguration/TokenConfigurationChangeItem.js';
export declare class TokenConfigUpdateTransitionWASM {
    /** @private **/
    _rawTransition: TokenConfigUpdateTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, updateTokenConfigurationItem: TokenConfigurationChangeItemWASM, publicNote?: string);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get publicNote(): string | undefined;
    set publicNote(value: string | undefined);
    get updateTokenConfigurationItem(): TokenConfigurationChangeItemWASM;
    set updateTokenConfigurationItem(value: TokenConfigurationChangeItemWASM);
    static createFromRawInstance(rawInstance: TokenConfigUpdateTransitionNAPI): TokenConfigUpdateTransitionWASM;
}
