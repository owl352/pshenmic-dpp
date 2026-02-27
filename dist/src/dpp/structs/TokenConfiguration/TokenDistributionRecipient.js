import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue } from '../../utils.js';
import { IdentifierWASM } from '../Identifier.js';
export class TokenDistributionRecipientWASM {
    /** @private **/
    _rawTokenDistributionRecipient;
    constructor(rawInstance) {
        this._rawTokenDistributionRecipient = rawInstance;
    }
    getType() {
        return this._rawTokenDistributionRecipient.getType();
    }
    getValue() {
        const value = this._rawTokenDistributionRecipient.getValue();
        if (value !== undefined) {
            return IdentifierWASM.createFromRawInstance(value);
        }
    }
    static ContractOwner() {
        return new TokenDistributionRecipientWASM(dppProvider.dpp.TokenDistributionRecipientNAPI.ContractOwner());
    }
    static Identity(id) {
        return new TokenDistributionRecipientWASM(dppProvider.dpp.TokenDistributionRecipientNAPI.Identity(prepareIdentifierValue(id)));
    }
    static EvonodesByParticipation() {
        return new TokenDistributionRecipientWASM(dppProvider.dpp.TokenDistributionRecipientNAPI.EvonodesByParticipation());
    }
    static createFromRawInstance(rawInstance) {
        return new TokenDistributionRecipientWASM(rawInstance);
    }
}
