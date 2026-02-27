import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
export function verifyTokenBalancesForIdentitiesProof(proof, tokenId, isProofSubset, identitiesIds, platformVersion) {
    const result = dppProvider.dpp.verifyTokenBalancesForIdentitiesProof(proof, prepareIdentifierValue(tokenId), isProofSubset, identitiesIds.map(prepareIdentifierValue), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        balances: result.balances.map(balance => ({
            balance: balance.balance != null ? BigInt(balance.balance) : undefined,
            id: IdentifierWASM.createFromRawInstance(balance.id)
        }))
    };
}
