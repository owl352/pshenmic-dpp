import type { ShieldedWithdrawalResultNAPI } from 'dash-platform-shielded/bindingsTypes';
import { StateTransitionWASM } from '../StateTransition.js';
/** Result of a proving shielded spend (withdrawal / unshield / transfer). */
export declare class ShieldedWithdrawalResultWASM {
    /** @private **/
    _rawShieldedWithdrawalResult: ShieldedWithdrawalResultNAPI;
    get stateTransition(): StateTransitionWASM;
    /** The fixed shielded fee (credits) consensus charges for the spend. */
    get fee(): bigint;
    static createFromRawInstance(rawInstance: ShieldedWithdrawalResultNAPI): ShieldedWithdrawalResultWASM;
}
