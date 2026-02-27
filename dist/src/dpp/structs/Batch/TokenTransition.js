import { dppProvider } from '../../provider.js';
import { TokenBurnTransitionWASM } from './TokenTransitions/TokenBurnTransition.js';
import { TokenDestroyFrozenFundsTransitionWASM } from './TokenTransitions/TokenDestroyFrozenFundsTransition.js';
import { TokenConfigUpdateTransitionWASM } from './TokenTransitions/TokenConfigUpdateTransition.js';
import { TokenClaimTransitionWASM } from './TokenTransitions/TokenClaimTransition.js';
import { TokenSetPriceForDirectPurchaseTransitionWASM } from './TokenTransitions/TokenSetPriceForDirectPurchaseTransition.js';
import { TokenTransferTransitionWASM } from './TokenTransitions/TokenTransferTransition.js';
import { TokenUnFreezeTransitionWASM } from './TokenTransitions/TokenUnFreezeTransition.js';
import { TokenMintTransitionWASM } from './TokenTransitions/TokenMintTransition.js';
import { TokenFreezeTransitionWASM } from './TokenTransitions/TokenFreezeTransition.js';
import { TokenEmergencyActionTransitionWASM } from './TokenTransitions/TokenEmergencyActionTransition.js';
import { TokenDirectPurchaseTransitionWASM } from './TokenTransitions/TokenDirectPurchaseTransition.js';
import { IdentifierWASM } from '../Identifier.js';
import { prepareIdentifierValue } from '../../utils.js';
export class TokenTransitionWASM {
    /** @private **/
    _rawTokenTransition;
    constructor(transition) {
        this._rawTokenTransition = new dppProvider.dpp.TokenTransitionNAPI(transition._rawTransition);
    }
    get identityContractNonce() {
        return BigInt(this._rawTokenTransition.identityContractNonce);
    }
    set identityContractNonce(value) {
        this._rawTokenTransition.identityContractNonce = value.toString();
    }
    get tokenId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenTransition.tokenId);
    }
    set tokenId(value) {
        this._rawTokenTransition.tokenId = prepareIdentifierValue(value);
    }
    get contractId() {
        return IdentifierWASM.createFromRawInstance(this._rawTokenTransition.contractId);
    }
    set contractId(value) {
        this._rawTokenTransition.contractId = prepareIdentifierValue(value);
    }
    getTransition() {
        const transition = this._rawTokenTransition.getTransition();
        if (transition instanceof dppProvider.dpp.TokenBurnTransitionNAPI) {
            return TokenBurnTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenClaimTransitionNAPI) {
            return TokenClaimTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenConfigUpdateTransitionNAPI) {
            return TokenConfigUpdateTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenDestroyFrozenFundsTransitionNAPI) {
            return TokenDestroyFrozenFundsTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenDirectPurchaseTransitionNAPI) {
            return TokenDirectPurchaseTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenEmergencyActionTransitionNAPI) {
            return TokenEmergencyActionTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenFreezeTransitionNAPI) {
            return TokenFreezeTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenMintTransitionNAPI) {
            return TokenMintTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenSetPriceForDirectPurchaseTransitionNAPI) {
            return TokenSetPriceForDirectPurchaseTransitionWASM.createFromRawInstance(transition);
        }
        else if (transition instanceof dppProvider.dpp.TokenTransferTransitionNAPI) {
            return TokenTransferTransitionWASM.createFromRawInstance(transition);
        }
        else {
            return TokenUnFreezeTransitionWASM.createFromRawInstance(transition);
        }
    }
    getTransitionTypeNumber() {
        return this._rawTokenTransition.getTransitionTypeNumber();
    }
    getTransitionType() {
        return this._rawTokenTransition.getTransitionType();
    }
    getHistoricalDocumentTypeName() {
        return this._rawTokenTransition.getHistoricalDocumentTypeName();
    }
    getHistoricalDocumentId(ownerId) {
        return IdentifierWASM.createFromRawInstance(this._rawTokenTransition.getHistoricalDocumentId(prepareIdentifierValue(ownerId)));
    }
    idDocumentTransition() {
        return false;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenTransitionWASM.prototype);
        instance._rawTokenTransition = rawInstance;
        return instance;
    }
}
