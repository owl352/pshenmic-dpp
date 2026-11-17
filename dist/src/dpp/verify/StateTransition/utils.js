import { DataContractWASM } from '../../structs/DataContract.js';
import { IdentityWASM } from '../../structs/Identity.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
import { TokenPricingScheduleWASM } from '../../structs/Batch/TokenPricingSchedule.js';
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js';
import { VoteWASM } from '../../structs/MasternodeVote/Vote.js';
import { DocumentWASM } from '../../structs/Document.js';
import { PlatformAddressWASM } from '../../structs/PlatformAddress/PlatformAddress.js';
import { dppProvider } from '../../provider.js';
import { plainProofValue } from '../../utils.js';
const converters = () => {
    return new Map([
        [dppProvider.dpp.DataContractNAPI, v => DataContractWASM.createFromRawInstance(v)],
        [dppProvider.dpp.IdentityNAPI, v => IdentityWASM.createFromRawInstance(v)],
        [dppProvider.dpp.IdentifierNAPI, v => IdentifierWASM.createFromRawInstance(v)],
        [dppProvider.dpp.PartialIdentityNAPI, v => PartialIdentityWASM.createFromRawInstance(v)],
        [dppProvider.dpp.DocumentNAPI, v => DocumentWASM.createFromRawInstance(v)],
        [dppProvider.dpp.VoteNAPI, v => VoteWASM.createFromRawInstance(v)],
        [dppProvider.dpp.IdentityTokenBalanceNAPI, (v) => ({
                id: IdentifierWASM.createFromRawInstance(v.id),
                balance: BigInt(v.balance)
            })],
        [dppProvider.dpp.VerifiedIdentityTokenInfoNAPI, (v) => ({
                tokenId: IdentifierWASM.createFromRawInstance(v.id),
                identityTokenInfo: {
                    frozen: v.identityTokenInfo.frozen
                }
            })],
        [dppProvider.dpp.VerifiedTokenPricingScheduleNAPI, (v) => ({
                tokenId: IdentifierWASM.createFromRawInstance(v.id),
                pricingSchedule: v.pricingSchedule != null
                    ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule)
                    : undefined
            })],
        [dppProvider.dpp.TokenStatusNAPI, (v) => ({
                paused: v.paused
            })],
        [dppProvider.dpp.VerifiedBalanceTransferNAPI, (v) => ({
                sender: PartialIdentityWASM.createFromRawInstance(v.sender),
                recipient: PartialIdentityWASM.createFromRawInstance(v.recipient)
            })],
        [dppProvider.dpp.VerifiedTokenGroupActionWithDocumentNAPI, (v) => ({
                groupSumPower: v.groupSumPower,
                document: v.document != null ? DocumentWASM.createFromRawInstance(v.document) : undefined
            })],
        [dppProvider.dpp.VerifiedTokenGroupActionWithTokenBalanceNAPI, (v) => ({
                groupSumPower: v.groupSumPower,
                groupActionStatus: v.groupActionStatus,
                amount: v.amount != null ? BigInt(v.amount) : undefined
            })],
        [dppProvider.dpp.VerifiedTokenGroupActionWithTokenIdentityInfoNAPI, (v) => ({
                groupSumPower: v.groupSumPower,
                groupActionStatus: v.groupActionStatus,
                identityTokenInfo: v.identityTokenInfo != null ? { frozen: v.identityTokenInfo.frozen } : undefined
            })],
        [dppProvider.dpp.VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, (v) => ({
                groupSumPower: v.groupSumPower,
                groupActionStatus: v.groupActionStatus,
                pricingSchedule: v.pricingSchedule != null ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule) : undefined
            })],
        [dppProvider.dpp.VerifiedIdentityFullWithAddressInfosNAPI, (v) => ({
                identity: IdentityWASM.createFromRawInstance(v.identity),
                infos: v.infos.map(info => ({
                    nonce: info.nonce,
                    address: PlatformAddressWASM.createFromRawInstance(info.address),
                    balance: info.credits != null ? BigInt(info.credits) : undefined
                }))
            })],
        [dppProvider.dpp.VerifiedIdentityWithAddressInfosNAPI, (v) => ({
                identity: PartialIdentityWASM.createFromRawInstance(v.identity),
                infos: v.infos.map(info => ({
                    nonce: info.nonce,
                    address: PlatformAddressWASM.createFromRawInstance(info.address),
                    balance: info.credits != null ? BigInt(info.credits) : undefined
                }))
            })]
    ]);
};
function convertPlatformAddressInfos(infos) {
    return infos.map(info => ({
        nonce: info.nonce,
        address: PlatformAddressWASM.createFromRawInstance(info.address),
        balance: info.credits != null ? BigInt(info.credits) : undefined
    }));
}
function convertVerifiedDocuments(docs) {
    return docs.map(item => ({
        id: IdentifierWASM.createFromRawInstance(item.id),
        document: item.document != null
            ? DocumentWASM.createFromRawInstance(item.document)
            : undefined
    }));
}
function convertAssetLockValue(v) {
    return {
        initialCreditValue: BigInt(v.initialCreditValue),
        txOutScript: v.txOutScript,
        remainingCreditValue: BigInt(v.remainingCreditValue),
        usedTags: v.usedTags
    };
}
function convertStoredAssetLockInfo(v) {
    return {
        type: v.type,
        value: v.value != null ? convertAssetLockValue(v.value) : undefined
    };
}
function convertArray(result) {
    const [first] = result;
    if (first == null)
        return [];
    if (first instanceof dppProvider.dpp.IdentityTokenBalanceNAPI) {
        return result.map(item => ({
            id: IdentifierWASM.createFromRawInstance(item.id),
            balance: BigInt(item.balance)
        }));
    }
    if (first instanceof dppProvider.dpp.VerifiedDocumentNAPI) {
        return convertVerifiedDocuments(result);
    }
    if (first instanceof dppProvider.dpp.PlatformAddressInfoNAPI) {
        return convertPlatformAddressInfos(result);
    }
    throw new Error('Unknown array type');
}
function convertTuple(result) {
    const [first, second] = result;
    if (first instanceof dppProvider.dpp.StoredAssetLockInfoNAPI) {
        return {
            storedAssetLockInfo: convertStoredAssetLockInfo(first),
            infos: convertPlatformAddressInfos(second)
        };
    }
    if (first instanceof dppProvider.dpp.IdentityNAPI) {
        return {
            identity: IdentityWASM.createFromRawInstance(first),
            nullifiers: second
        };
    }
    if (Array.isArray(first) && Array.isArray(second)) {
        const secondFirst = second[0];
        if (secondFirst != null && secondFirst instanceof dppProvider.dpp.VerifiedDocumentNAPI) {
            return {
                nullifiers: first,
                documents: convertVerifiedDocuments(second)
            };
        }
        return {
            nullifiers: first,
            infos: secondFirst != null ? convertPlatformAddressInfos(second) : []
        };
    }
    throw new Error('Unknown tuple type');
}
export function convertResult(result) {
    // The results added in v5 come as plain objects tagged with `$type`
    if (result instanceof dppProvider.dpp.DynamicValue) {
        return plainProofValue(result);
    }
    if (Array.isArray(result)) {
        if (result.length === 2) {
            const [first] = result;
            if (first instanceof dppProvider.dpp.StoredAssetLockInfoNAPI || first instanceof dppProvider.dpp.IdentityNAPI) {
                return convertTuple(result);
            }
            if (Array.isArray(first) && (first.length === 0 || Array.isArray(first[0]))) {
                return convertTuple(result);
            }
        }
        const [first] = result;
        if (first != null && Array.isArray(first) && first[0] instanceof Uint8Array) {
            return result;
        }
        return convertArray(result);
    }
    if (result instanceof dppProvider.dpp.StoredAssetLockInfoNAPI) {
        return convertStoredAssetLockInfo(result);
    }
    for (const [Type, handler] of converters()) {
        if (result instanceof Type) {
            return handler(result);
        }
    }
    throw new Error(`Unknown result type: ${result?.constructor?.name}`);
}
