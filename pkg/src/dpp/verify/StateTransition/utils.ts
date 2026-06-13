import {
  AssetLockValue,
  IdentityTokenBalance,
  ShieldedNullifier,
  StoredAssetLockInfo,
  TokenStatus,
  VerifiedAssetLockConsumedWithAddressInfos,
  VerifiedPlatformAddressInfo, VerifiedBalanceTransfer,
  VerifiedDocument,
  VerifiedIdentityBalance, VerifiedIdentityFullWithAddressInfos, VerifiedIdentityTokenInfo,
  VerifiedIdentityWithAddressInfos,
  VerifiedIdentityWithShieldedNullifiers,
  VerifiedShieldedNullifiersWithAddressInfos,
  VerifiedShieldedNullifiersWithWithdrawalDocument,
  VerifiedStateTransitionResultVariants, VerifiedStateTransitionResultVariantsRAW,
  VerifiedTokenGroupActionWithDocument, VerifiedTokenGroupActionWithTokenBalance,
  VerifiedTokenGroupActionWithTokenIdentityInfo,
  VerifiedTokenGroupActionWithTokenPricingSchedule, VerifiedTokenPricingSchedule
} from '../../types.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import type {
  AssetLockValueNAPI,
  IdentityTokenBalanceNAPI, TokenStatusNAPI,
  PlatformAddressInfoNAPI, StoredAssetLockInfoNAPI, VerifiedBalanceTransferNAPI, VerifiedDocumentNAPI, VerifiedIdentityFullWithAddressInfosNAPI,
  VerifiedIdentityTokenInfoNAPI, VerifiedIdentityWithAddressInfosNAPI, VerifiedTokenGroupActionWithDocumentNAPI,
  VerifiedTokenGroupActionWithTokenBalanceNAPI,
  VerifiedTokenGroupActionWithTokenIdentityInfoNAPI,
  VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, VerifiedTokenPricingScheduleNAPI
} from '../../../../binaries/bindingsTypes.js'
import { IdentityWASM } from '../../structs/Identity.js'
import { IdentifierWASM } from '../../structs/Identifier.js'
import { TokenPricingScheduleWASM } from '../../structs/Batch/TokenPricingSchedule.js'
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js'
import { VoteWASM } from '../../structs/MasternodeVote/Vote.js'
import { DocumentWASM } from '../../structs/Document.js'
import { PlatformAddressWASM } from '../../structs/PlatformAddress/PlatformAddress.js'
import { dppProvider } from '../../provider.js'

type Converter = (value: any) => VerifiedStateTransitionResultVariants

const converters: () => Map<Function, Converter> = (): Map<Function, Converter> => {
  return new Map<Function, Converter>([
    [dppProvider.dpp.DataContractNAPI, v => DataContractWASM.createFromRawInstance(v)],
    [dppProvider.dpp.IdentityNAPI, v => IdentityWASM.createFromRawInstance(v)],
    [dppProvider.dpp.IdentifierNAPI, v => IdentifierWASM.createFromRawInstance(v)],
    [dppProvider.dpp.PartialIdentityNAPI, v => PartialIdentityWASM.createFromRawInstance(v)],
    [dppProvider.dpp.DocumentNAPI, v => DocumentWASM.createFromRawInstance(v)],
    [dppProvider.dpp.VoteNAPI, v => VoteWASM.createFromRawInstance(v)],

    [dppProvider.dpp.IdentityTokenBalanceNAPI, (v): IdentityTokenBalance => ({
      id: IdentifierWASM.createFromRawInstance(v.id),
      balance: BigInt(v.balance)
    })],

    [dppProvider.dpp.VerifiedIdentityTokenInfoNAPI, (v: VerifiedIdentityTokenInfoNAPI): VerifiedIdentityTokenInfo => ({
      tokenId: IdentifierWASM.createFromRawInstance(v.id),
      identityTokenInfo: {
        frozen: v.identityTokenInfo.frozen
      }
    })],

    [dppProvider.dpp.VerifiedTokenPricingScheduleNAPI, (v: VerifiedTokenPricingScheduleNAPI): VerifiedTokenPricingSchedule => ({
      tokenId: IdentifierWASM.createFromRawInstance(v.id),
      pricingSchedule: v.pricingSchedule != null
        ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule)
        : undefined
    })],

    [dppProvider.dpp.TokenStatusNAPI, (v: TokenStatusNAPI): TokenStatus => ({
      paused: v.paused
    })],

    [dppProvider.dpp.VerifiedBalanceTransferNAPI, (v: VerifiedBalanceTransferNAPI): VerifiedBalanceTransfer => ({
      sender: PartialIdentityWASM.createFromRawInstance(v.sender),
      recipient: PartialIdentityWASM.createFromRawInstance(v.recipient)
    })],

    [dppProvider.dpp.VerifiedTokenGroupActionWithDocumentNAPI, (v: VerifiedTokenGroupActionWithDocumentNAPI): VerifiedTokenGroupActionWithDocument => ({
      groupSumPower: v.groupSumPower,
      document: v.document != null ? DocumentWASM.createFromRawInstance(v.document) : undefined
    })],

    [dppProvider.dpp.VerifiedTokenGroupActionWithTokenBalanceNAPI, (v: VerifiedTokenGroupActionWithTokenBalanceNAPI): VerifiedTokenGroupActionWithTokenBalance => ({
      groupSumPower: v.groupSumPower,
      groupActionStatus: v.groupActionStatus,
      amount: v.amount != null ? BigInt(v.amount) : undefined
    })],

    [dppProvider.dpp.VerifiedTokenGroupActionWithTokenIdentityInfoNAPI, (v: VerifiedTokenGroupActionWithTokenIdentityInfoNAPI): VerifiedTokenGroupActionWithTokenIdentityInfo => ({
      groupSumPower: v.groupSumPower,
      groupActionStatus: v.groupActionStatus,
      identityTokenInfo: v.identityTokenInfo != null ? { frozen: v.identityTokenInfo.frozen } : undefined
    })],

    [dppProvider.dpp.VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, (v: VerifiedTokenGroupActionWithTokenPricingScheduleNAPI): VerifiedTokenGroupActionWithTokenPricingSchedule => ({
      groupSumPower: v.groupSumPower,
      groupActionStatus: v.groupActionStatus,
      pricingSchedule: v.pricingSchedule != null ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule) : undefined
    })],

    [dppProvider.dpp.VerifiedIdentityFullWithAddressInfosNAPI, (v: VerifiedIdentityFullWithAddressInfosNAPI): VerifiedIdentityFullWithAddressInfos => ({
      identity: IdentityWASM.createFromRawInstance(v.identity),
      infos: v.infos.map(info => ({
        nonce: info.nonce,
        address: PlatformAddressWASM.createFromRawInstance(info.address),
        balance: info.credits != null ? BigInt(info.credits) : undefined
      }))
    })],

    [dppProvider.dpp.VerifiedIdentityWithAddressInfosNAPI, (v: VerifiedIdentityWithAddressInfosNAPI): VerifiedIdentityWithAddressInfos => ({
      identity: PartialIdentityWASM.createFromRawInstance(v.identity),
      infos: v.infos.map(info => ({
        nonce: info.nonce,
        address: PlatformAddressWASM.createFromRawInstance(info.address),
        balance: info.credits != null ? BigInt(info.credits) : undefined
      }))
    })]
  ])
}

function convertPlatformAddressInfos (infos: PlatformAddressInfoNAPI[]): VerifiedPlatformAddressInfo[] {
  return infos.map(info => ({
    nonce: info.nonce,
    address: PlatformAddressWASM.createFromRawInstance(info.address),
    balance: info.credits != null ? BigInt(info.credits) : undefined
  }))
}

function convertVerifiedDocuments (docs: VerifiedDocumentNAPI[]): VerifiedDocument[] {
  return docs.map(item => ({
    id: IdentifierWASM.createFromRawInstance(item.id),
    document: item.document != null
      ? DocumentWASM.createFromRawInstance(item.document)
      : undefined
  }))
}

function convertAssetLockValue (v: AssetLockValueNAPI): AssetLockValue {
  return {
    initialCreditValue: BigInt(v.initialCreditValue),
    txOutScript: v.txOutScript,
    remainingCreditValue: BigInt(v.remainingCreditValue),
    usedTags: v.usedTags
  }
}

function convertStoredAssetLockInfo (v: StoredAssetLockInfoNAPI): StoredAssetLockInfo {
  return {
    type: v.type as StoredAssetLockInfo['type'],
    value: v.value != null ? convertAssetLockValue(v.value) : undefined
  }
}

function convertArray (result: IdentityTokenBalanceNAPI[] | VerifiedDocumentNAPI[] | PlatformAddressInfoNAPI[]): VerifiedIdentityBalance[] | VerifiedDocument[] | VerifiedPlatformAddressInfo[] {
  const [first] = result
  if (first == null) return []

  if (first instanceof dppProvider.dpp.IdentityTokenBalanceNAPI) {
    return (result as IdentityTokenBalanceNAPI[]).map(item => ({
      id: IdentifierWASM.createFromRawInstance(item.id),
      balance: BigInt(item.balance)
    }))
  }

  if (first instanceof dppProvider.dpp.VerifiedDocumentNAPI) {
    return convertVerifiedDocuments(result as VerifiedDocumentNAPI[])
  }

  if (first instanceof dppProvider.dpp.PlatformAddressInfoNAPI) {
    return convertPlatformAddressInfos(result as PlatformAddressInfoNAPI[])
  }

  throw new Error('Unknown array type')
}

function convertTuple (result: any[]): VerifiedStateTransitionResultVariants {
  const [first, second] = result

  if (first instanceof dppProvider.dpp.StoredAssetLockInfoNAPI) {
    return {
      storedAssetLockInfo: convertStoredAssetLockInfo(first),
      infos: convertPlatformAddressInfos(second)
    } as VerifiedAssetLockConsumedWithAddressInfos
  }

  if (first instanceof dppProvider.dpp.IdentityNAPI) {
    return {
      identity: IdentityWASM.createFromRawInstance(first),
      nullifiers: second as ShieldedNullifier[]
    } as VerifiedIdentityWithShieldedNullifiers
  }

  if (Array.isArray(first) && Array.isArray(second)) {
    const secondFirst = second[0]

    if (secondFirst != null && secondFirst instanceof dppProvider.dpp.VerifiedDocumentNAPI) {
      return {
        nullifiers: first as ShieldedNullifier[],
        documents: convertVerifiedDocuments(second)
      } as VerifiedShieldedNullifiersWithWithdrawalDocument
    }

    return {
      nullifiers: first as ShieldedNullifier[],
      infos: secondFirst != null ? convertPlatformAddressInfos(second) : []
    } as VerifiedShieldedNullifiersWithAddressInfos
  }

  throw new Error('Unknown tuple type')
}

export function convertResult (result: VerifiedStateTransitionResultVariantsRAW): VerifiedStateTransitionResultVariants {
  if (Array.isArray(result)) {
    if (result.length === 2) {
      const [first] = result

      if (first instanceof dppProvider.dpp.StoredAssetLockInfoNAPI || first instanceof dppProvider.dpp.IdentityNAPI) {
        return convertTuple(result)
      }

      if (Array.isArray(first) && (first.length === 0 || Array.isArray(first[0]))) {
        return convertTuple(result)
      }
    }

    const [first] = result
    if (first != null && Array.isArray(first) && first[0] instanceof Uint8Array) {
      return result as ShieldedNullifier[]
    }

    return convertArray(result as any)
  }

  if (result instanceof dppProvider.dpp.StoredAssetLockInfoNAPI) {
    return convertStoredAssetLockInfo(result as StoredAssetLockInfoNAPI)
  }

  for (const [Type, handler] of converters()) {
    if (result instanceof Type) {
      return handler(result)
    }
  }

  throw new Error(`Unknown result type: ${result?.constructor?.name}`)
}