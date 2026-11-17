import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
export function verifyTokensBalancesForIdentityProof(proof, tokenIds, identityId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyTokensBalancesForIdentityProof(proof, tokenIds.map(prepareIdentifierValue), prepareIdentifierValue(identityId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        balances: result.balances.map(balance => ({
            balance: balance.balance != null ? BigInt(balance.balance) : undefined,
            id: IdentifierWASM.createFromRawInstance(balance.id)
        }))
    };
}
