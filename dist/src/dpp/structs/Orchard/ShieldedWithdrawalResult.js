import { StateTransitionWASM } from '../StateTransition.js';
/** Result of a proving shielded spend (withdrawal / unshield / transfer). */
export class ShieldedWithdrawalResultWASM {
    /** @private **/
    _rawShieldedWithdrawalResult;
    get stateTransition() {
        return StateTransitionWASM.fromBytes(this._rawShieldedWithdrawalResult.stateTransition);
    }
    /** The fixed shielded fee (credits) consensus charges for the spend. */
    get fee() {
        return BigInt(this._rawShieldedWithdrawalResult.fee);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedWithdrawalResultWASM.prototype);
        instance._rawShieldedWithdrawalResult = rawInstance;
        return instance;
    }
}
