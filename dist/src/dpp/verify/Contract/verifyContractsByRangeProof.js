import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/** A page of the contracts tree in id order; with `idsOnly` no contract is returned **/
export function verifyContractsByRangeProof(proof, startAt, startAtIncluded, limit, idsOnly, platformVersion) {
    const result = dppProvider.dpp.verifyContractsByRangeProof(proof, startAt != null ? prepareIdentifierValue(startAt) : undefined, startAtIncluded, limit, idsOnly, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        contracts: result.contracts.map(contract => ({
            id: IdentifierWASM.createFromRawInstance(contract.id),
            dataContract: contract.dataContract != null ? DataContractWASM.createFromRawInstance(contract.dataContract) : undefined
        }))
    };
}
