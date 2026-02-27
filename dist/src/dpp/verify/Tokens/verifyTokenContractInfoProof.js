import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
export function verifyTokenContractInfoProof(proof, tokenId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyTokenContractInfoProof(proof, prepareIdentifierValue(tokenId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        contractInfo: result.contractInfo != null
            ? {
                contractId: IdentifierWASM.createFromRawInstance(result.contractInfo.contractId),
                tokenContractPosition: result.contractInfo.tokenContractPosition
            }
            : undefined
    };
}
