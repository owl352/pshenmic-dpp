import {
  VerifiedAddressInfo,
  VerifiedDocument,
  VerifiedIdentityBalance,
  VerifiedStateTransitionResultVariants, VerifiedStateTransitionResultVariantsRAW
} from '../../types.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import {
  DataContractNAPI, DocumentNAPI,
  IdentityNAPI,
  IdentityTokenBalanceNAPI, PartialIdentityNAPI, TokenStatusNAPI,
  VerifiedAddressInfosNAPI, VerifiedBalanceTransferNAPI, VerifiedDocumentNAPI, VerifiedIdentityFullWithAddressInfosNAPI,
  VerifiedIdentityTokenInfoNAPI, VerifiedIdentityWithAddressInfosNAPI, VerifiedTokenGroupActionWithDocumentNAPI,
  VerifiedTokenGroupActionWithTokenBalanceNAPI,
  VerifiedTokenGroupActionWithTokenIdentityInfoNAPI,
  VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, VerifiedTokenPricingScheduleNAPI,
  VoteNAPI
} from '../../../../binaries/bindingsTypes.js'
import { IdentityWASM } from '../../structs/Identity.js'
import { IdentifierWASM } from '../../structs/Identifier.js'
import { TokenPricingScheduleWASM } from '../../structs/Batch/TokenPricingSchedule.js'
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js'
import { VoteWASM } from '../../structs/MasternodeVote/Vote.js'
import { DocumentWASM } from '../../structs/Document.js'
import { PlatformAddressWASM } from '../../structs/Address/PlatformAddress.js'

type Converter = (value: any) => VerifiedStateTransitionResultVariants

const converters = new Map<Function, Converter>([
  [DataContractNAPI, v => DataContractWASM.createFromRawInstance(v)],
  [IdentityNAPI, v => IdentityWASM.createFromRawInstance(v)],
  [IdentifierWASM, v => IdentifierWASM.createFromRawInstance(v)],
  [PartialIdentityNAPI, v => PartialIdentityWASM.createFromRawInstance(v)],
  [DocumentNAPI, v => DocumentWASM.createFromRawInstance(v)],
  [VoteNAPI, v => VoteWASM.createFromRawInstance(v)],

  [IdentityTokenBalanceNAPI, v => ({
    id: IdentifierWASM.createFromRawInstance(v.id),
    balance: BigInt(v.balance)
  })],

  [VerifiedIdentityTokenInfoNAPI, (v: VerifiedIdentityTokenInfoNAPI) => ({
    id: IdentifierWASM.createFromRawInstance(v.id),
    identityTokenInfo: {
      frozen: v.identityTokenInfo.frozen
    }
  })],

  [VerifiedTokenPricingScheduleNAPI, (v: VerifiedTokenPricingScheduleNAPI) => ({
    id: IdentifierWASM.createFromRawInstance(v.id),
    pricingSchedule: v.pricingSchedule != null
      ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule)
      : undefined
  })],

  [TokenStatusNAPI, (v: TokenStatusNAPI) => ({
    paused: v.paused
  })],

  [VerifiedBalanceTransferNAPI, (v: VerifiedBalanceTransferNAPI) => ({
    sender: PartialIdentityWASM.createFromRawInstance(v.sender),
    recipient: PartialIdentityWASM.createFromRawInstance(v.recipient)
  })],

  [VerifiedTokenGroupActionWithDocumentNAPI, (v: VerifiedTokenGroupActionWithDocumentNAPI) => ({
    groupSumPower: v.groupSumPower,
    document: v.document != null ? DocumentWASM.createFromRawInstance(v.document) : undefined
  })],

  [VerifiedTokenGroupActionWithTokenBalanceNAPI, (v: VerifiedTokenGroupActionWithTokenBalanceNAPI) => ({
    groupSumPower: v.groupSumPower,
    groupActionStatus: v.groupActionStatus,
    amount: v.amount != null ? BigInt(v.amount) : undefined
  })],

  [VerifiedTokenGroupActionWithTokenIdentityInfoNAPI, (v: VerifiedTokenGroupActionWithTokenIdentityInfoNAPI) => ({
    groupSumPower: v.groupSumPower,
    groupActionStatus: v.groupActionStatus,
    identityTokenInfo: v.identityTokenInfo != null ? { frozen: v.identityTokenInfo.frozen } : undefined
  })],

  [VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, (v: VerifiedTokenGroupActionWithTokenPricingScheduleNAPI) => ({
    groupSumPower: v.groupSumPower,
    groupActionStatus: v.groupActionStatus,
    pricingSchedule: v.pricingSchedule != null ? TokenPricingScheduleWASM.createFromRawInstance(v.pricingSchedule) : undefined
  })],

  [VerifiedIdentityFullWithAddressInfosNAPI, (v: VerifiedIdentityFullWithAddressInfosNAPI) => ({
    identity: IdentityWASM.createFromRawInstance(v.identity),
    infos: v.infos.map(info => ({
      nonce: info.nonce,
      address: PlatformAddressWASM.createFromRawInstance(info.address),
      credits: info.credits != null ? BigInt(info.credits) : undefined
    }))
  })],

  [VerifiedIdentityWithAddressInfosNAPI, (v: VerifiedIdentityWithAddressInfosNAPI) => ({
    identity: PartialIdentityWASM.createFromRawInstance(v.identity),
    infos: v.infos.map(info => ({
      nonce: info.nonce,
      address: PlatformAddressWASM.createFromRawInstance(info.address),
      credits: info.credits != null ? BigInt(info.credits) : undefined
    }))
  })]
])

function convertArray (result: IdentityTokenBalanceNAPI[] | VerifiedDocumentNAPI[] | VerifiedAddressInfosNAPI[]): VerifiedIdentityBalance[] | VerifiedDocument[] | VerifiedAddressInfo[] {
  const [first] = result
  if (first == null) return []

  if (first instanceof IdentityTokenBalanceNAPI) {
    return (result as IdentityTokenBalanceNAPI[]).map(item => ({
      id: IdentifierWASM.createFromRawInstance(item.id),
      balance: BigInt(item.balance)
    }))
  }

  if (first instanceof VerifiedDocumentNAPI) {
    return (result as VerifiedDocumentNAPI[]).map(item => ({
      id: IdentifierWASM.createFromRawInstance(item.id),
      document: item.document != null
        ? DocumentWASM.createFromRawInstance(item.document)
        : undefined
    }))
  }

  if (first instanceof VerifiedAddressInfosNAPI) {
    return (result as VerifiedAddressInfosNAPI[]).map(item => ({
      nonce: item.nonce,
      address: PlatformAddressWASM.createFromRawInstance(item.address),
      credits: item.credits != null ? BigInt(item.credits) : undefined
    }))
  }

  throw new Error('Unknown array type')
}

export function convertResult (result: VerifiedStateTransitionResultVariantsRAW): VerifiedStateTransitionResultVariants {
  if (Array.isArray(result)) {
    return convertArray(result)
  }

  for (const [Type, handler] of converters) {
    if (result instanceof Type) {
      return handler(result)
    }
  }

  throw new Error(`Unknown result type: ${result?.constructor?.name}`)
}
