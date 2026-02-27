import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export function verifyTokenTotalSupplyProof(proof, tokenId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyTokenTotalSupplyProof(proof, prepareIdentifierValue(tokenId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        totalBalance: {
            tokenSupply: BigInt(result.totalBalance.tokenSupply),
            aggregatedTokenAccountBalances: BigInt(result.totalBalance.aggregatedTokenAccountBalances)
        }
    };
}
