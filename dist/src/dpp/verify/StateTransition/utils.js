import { DataContractWASM } from '../../structs/DataContract.js';
import { IdentityWASM } from '../../structs/Identity.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
import { TokenPricingScheduleWASM } from '../../structs/Batch/TokenPricingSchedule.js';
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js';
import { VoteWASM } from '../../structs/MasternodeVote/Vote.js';
import { DocumentWASM } from '../../structs/Document.js';
import { PlatformAddressWASM } from '../../structs/Address/PlatformAddress.js';
import { dppProvider } from '../../provider.js';
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
                    credits: info.credits != null ? BigInt(info.credits) : undefined
                }))
            })],
        [dppProvider.dpp.VerifiedIdentityWithAddressInfosNAPI, (v) => ({
                identity: PartialIdentityWASM.createFromRawInstance(v.identity),
                infos: v.infos.map(info => ({
                    nonce: info.nonce,
                    address: PlatformAddressWASM.createFromRawInstance(info.address),
                    credits: info.credits != null ? BigInt(info.credits) : undefined
                }))
            })]
    ]);
};
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
        return result.map(item => ({
            id: IdentifierWASM.createFromRawInstance(item.id),
            document: item.document != null
                ? DocumentWASM.createFromRawInstance(item.document)
                : undefined
        }));
    }
    if (first instanceof dppProvider.dpp.VerifiedAddressInfosNAPI) {
        return result.map(item => ({
            nonce: item.nonce,
            address: PlatformAddressWASM.createFromRawInstance(item.address),
            credits: item.credits != null ? BigInt(item.credits) : undefined
        }));
    }
    throw new Error('Unknown array type');
}
export function convertResult(result) {
    if (Array.isArray(result)) {
        return convertArray(result);
    }
    for (const [Type, handler] of converters()) {
        if (result instanceof Type) {
            return handler(result);
        }
    }
    throw new Error(`Unknown result type: ${result?.constructor?.name}`);
}
