import { dppProvider } from '../../provider.js';
import { valueFromDynamicValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
export function verifyVotePollVoteStateProof(proof, contract, documentTypeName, indexName, indexValues, resultType, allowIncludeLockedAndAbstainingVoteTally, count, startAt, platformVersion) {
    const result = dppProvider.dpp.verifyVotePollVoteStateProof(proof, contract._rawDataContract, documentTypeName, indexName, indexValues, valueToDynamicValue(resultType), allowIncludeLockedAndAbstainingVoteTally ?? true, count, valueToDynamicValue(startAt), valueToDynamicValue(platformVersion));
    const winner = valueFromDynamicValue(result.result.winner);
    const winnerBlockInfo = winner?.blockInfo;
    const outWinner = winner != null
        ? {
            type: winner.type,
            identityId: winner.identityId,
            blockInfo: {
                height: BigInt(winnerBlockInfo.height),
                coreHeight: winnerBlockInfo.coreHeight,
                timeMs: BigInt(winnerBlockInfo.timeMs),
                epoch: winnerBlockInfo.epoch != null ? winnerBlockInfo?.epoch : undefined
            }
        }
        : undefined;
    return {
        rootHash: result.rootHash,
        result: {
            lockedVoteTally: result.result.lockedVoteTally ?? undefined,
            contenders: result.result.contenders.map(c => ({
                identityId: IdentifierWASM.createFromRawInstance(c.identityId),
                serializedDocument: c.serializedDocument ?? undefined,
                voteTally: c.voteTally ?? undefined
            })),
            abstainingVoteTally: result.result.abstainingVoteTally ?? undefined,
            winner: outWinner,
            skipped: result.result.skipped
        }
    };
}
