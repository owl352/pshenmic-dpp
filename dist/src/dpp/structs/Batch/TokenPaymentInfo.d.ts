import type { TokenPaymentInfoNAPI } from '../../../../binaries/bindingsTypes.js';
import { GasFeesPaidByLike, IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class TokenPaymentInfoWASM {
    /** @private **/
    _rawTokenPaymentInfo: TokenPaymentInfoNAPI;
    constructor(paymentTokenContractId: IdentifierLike | undefined | null, tokenContractPosition: number, minimumTokenCost?: bigint, maximumTokenCost?: bigint, gasFeesPaidBy?: GasFeesPaidByLike);
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
