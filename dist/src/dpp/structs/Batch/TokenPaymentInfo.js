import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class TokenPaymentInfoWASM {
    /** @private **/
    _rawTokenPaymentInfo;
    constructor(paymentTokenContractId, tokenContractPosition, minimumTokenCost, maximumTokenCost, gasFeesPaidBy) {
        this._rawTokenPaymentInfo = new dppProvider.dpp.TokenPaymentInfoNAPI(paymentTokenContractId != null ? prepareIdentifierValue(paymentTokenContractId) : undefined, tokenContractPosition, minimumTokenCost?.toString(), maximumTokenCost?.toString(), valueToDynamicValue(gasFeesPaidBy));
    }
    get paymentTokenContractId() {
        const id = this._rawTokenPaymentInfo.paymentTokenContractId;
        if (id != null) {
            return IdentifierWASM.createFromRawInstance(id);
        }
    }
    set paymentTokenContractId(id) {
        this._rawTokenPaymentInfo.paymentTokenContractId = id != null ? prepareIdentifierValue(id) : undefined;
    }
    get tokenContractPosition() {
        return this._rawTokenPaymentInfo.tokenContractPosition;
    }
    set tokenContractPosition(position) {
        this._rawTokenPaymentInfo.tokenContractPosition = position;
    }
    get minimumTokenCost() {
        const cost = this._rawTokenPaymentInfo.minimumTokenCost;
        if (cost != null) {
            return BigInt(cost);
        }
    }
    set minimumTokenCost(cost) {
        this._rawTokenPaymentInfo.minimumTokenCost = cost?.toString();
    }
    get maximumTokenCost() {
        const cost = this._rawTokenPaymentInfo.maximumTokenCost;
        if (cost != null) {
            return BigInt(cost);
        }
    }
    set maximumTokenCost(cost) {
        this._rawTokenPaymentInfo.maximumTokenCost = cost?.toString();
    }
    get gasFeesPaidBy() {
        return this._rawTokenPaymentInfo.gasFeesPaidBy;
    }
    set gasFeesPaidBy(value) {
        this._rawTokenPaymentInfo.gasFeesPaidBy = valueToDynamicValue(value);
    }
    static crateFromRawInstance(rawInstance) {
        const instance = Object.create(TokenPaymentInfoWASM.prototype);
        instance._rawTokenPaymentInfo = rawInstance;
        return instance;
    }
}
