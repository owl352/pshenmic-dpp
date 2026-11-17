import type { TokenDistributionRecipientNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class TokenDistributionRecipientWASM {
    /** @private **/
    _rawTokenDistributionRecipient: TokenDistributionRecipientNAPI;
    private constructor();
    getType(): string;
    getValue(): IdentifierWASM | undefined;
    static ContractOwner(): TokenDistributionRecipientWASM;
    static Identity(id: IdentifierLike): TokenDistributionRecipientWASM;
    static EvonodesByParticipation(): TokenDistributionRecipientWASM;
    static createFromRawInstance(rawInstance: TokenDistributionRecipientNAPI): TokenDistributionRecipientWASM;
}
