import type { TokenPaymentInfoNAPI } from '../../../../binaries/bindingsTypes.js';
import { GasFeesPaidByLike, IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
import { TokenShieldedPaymentWASM } from './TokenShieldedPayment.js';
export declare class TokenPaymentInfoWASM {
    /** @private **/
    _rawTokenPaymentInfo: TokenPaymentInfoNAPI;
    constructor(paymentTokenContractId: IdentifierLike | undefined | null, tokenContractPosition: number, minimumTokenCost?: bigint, maximumTokenCost?: bigint, gasFeesPaidBy?: GasFeesPaidByLike, shieldedPayment?: TokenShieldedPaymentWASM);
    get shieldedPayment(): TokenShieldedPaymentWASM | undefined;
    /** A shielded payment turns the payment info into V1, clearing it turns it back into V0 **/
    set shieldedPayment(value: TokenShieldedPaymentWASM | undefined | null);
    get paymentTokenContractId(): IdentifierWASM | undefined;
    set paymentTokenContractId(id: IdentifierWASM | undefined);
    get tokenContractPosition(): number;
    set tokenContractPosition(position: number);
    get minimumTokenCost(): bigint | undefined;
    set minimumTokenCost(cost: bigint | undefined);
    get maximumTokenCost(): bigint | undefined;
    set maximumTokenCost(cost: bigint | undefined);
    get gasFeesPaidBy(): string;
    set gasFeesPaidBy(value: GasFeesPaidByLike);
    static crateFromRawInstance(rawInstance: TokenPaymentInfoNAPI): TokenPaymentInfoWASM;
}
