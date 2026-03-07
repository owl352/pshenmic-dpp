import type * as protocol from '../../binaries/bindingsTypes.js'
import {
  ActionGoal, AssetLockProofType, GasFeesPaidByWASM,
  KeyType,
  NetworkWASM,
  PlatformVersionWASM, PoolingWASM,
  Purpose,
  SecurityLevel,
  TokenDistributionType, TokenEmergencyActionWASM, VoteStateResultType
} from './enums.js'
import { IdentifierWASM } from './structs/Identifier.js'
import { languageCodes } from './constants.js'
import { DistributionFunctionWASM } from './structs/TokenConfiguration/DistributionFunction.js'
import { TokenConfigurationWASM } from './structs/TokenConfiguration/TokenConfiguration.js'
import { GroupWASM } from './structs/TokenConfiguration/Group.js'
import { DocumentCreateTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentCreateTransition.js'
import { DocumentDeleteTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentDeleteTransition.js'
import { DocumentPurchaseTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentPurchaseTransition.js'
import { DocumentReplaceTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentReplaceTransition.js'
import { DocumentTransferTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentTransferTransition.js'
import { DocumentUpdatePriceTransitionWASM } from './structs/Batch/DocumentTransitions/DocumentUpdatePriceTransition.js'
import { TokenConfigUpdateTransitionWASM } from './structs/Batch/TokenTransitions/TokenConfigUpdateTransition.js'
import { TokenDirectPurchaseTransitionWASM } from './structs/Batch/TokenTransitions/TokenDirectPurchaseTransition.js'
import {
  TokenSetPriceForDirectPurchaseTransitionWASM
} from './structs/Batch/TokenTransitions/TokenSetPriceForDirectPurchaseTransition.js'
import { TokenBurnTransitionWASM } from './structs/Batch/TokenTransitions/TokenBurnTransition.js'
import { TokenClaimTransitionWASM } from './structs/Batch/TokenTransitions/TokenClaimTransition.js'
import { TokenUnFreezeTransitionWASM } from './structs/Batch/TokenTransitions/TokenUnFreezeTransition.js'
import { TokenTransferTransitionWASM } from './structs/Batch/TokenTransitions/TokenTransferTransition.js'
import { TokenMintTransitionWASM } from './structs/Batch/TokenTransitions/TokenMintTransition.js'
import { TokenFreezeTransitionWASM } from './structs/Batch/TokenTransitions/TokenFreezeTransition.js'
import { TokenEmergencyActionTransitionWASM } from './structs/Batch/TokenTransitions/TokenEmergencyActionTransition.js'
import {
  TokenDestroyFrozenFundsTransitionWASM
} from './structs/Batch/TokenTransitions/TokenDestroyFrozenFundsTransition.js'
import { DataContractWASM } from './structs/DataContract.js'
import { IdentityWASM } from './structs/Identity.js'
import { PartialIdentityWASM } from './structs/PartialIdentity.js'
import { DocumentWASM } from './structs/Document.js'
import { VoteWASM } from './structs/MasternodeVote/Vote.js'
import { TokenPricingScheduleWASM } from './structs/Batch/TokenPricingSchedule.js'
import { PlatformAddressWASM } from './structs/PlatformAddress/PlatformAddress.js'

export type DashPlatformProtocol = typeof protocol
export type IdentifierLike = string | Uint8Array | protocol.IdentifierNAPI | IdentifierWASM
export type PlatformAddressLike = string | Uint8Array | protocol.PlatformAddressNAPI | PlatformAddressWASM

export type KeyTypeLike = KeyType | keyof typeof KeyType | Lowercase<keyof typeof KeyType>
export type NetworkLike = NetworkWASM | keyof typeof NetworkWASM | Lowercase<keyof typeof NetworkWASM>
export type SecurityLevelLike = SecurityLevel | keyof typeof SecurityLevel | Lowercase<keyof typeof SecurityLevel>
export type PlatformVersionLike = PlatformVersionWASM | Lowercase<keyof typeof PlatformVersionWASM>
export type PurposeLike = Purpose | keyof typeof Purpose | Lowercase<keyof typeof Purpose>
export type ActionGoalLike = ActionGoal | keyof typeof ActionGoal | Lowercase<keyof typeof ActionGoal>
export type GasFeesPaidByLike = GasFeesPaidByWASM | keyof typeof GasFeesPaidByWASM | Lowercase<keyof typeof GasFeesPaidByWASM>
export type TokenDistributionLike = TokenDistributionType | keyof typeof TokenDistributionType | Lowercase<keyof typeof TokenDistributionType>
export type TokenEmergencyActionLike = TokenEmergencyActionWASM | keyof typeof TokenEmergencyActionWASM | Lowercase<keyof typeof TokenEmergencyActionWASM>
export type AssetLockProofTypeLike = AssetLockProofType | keyof typeof AssetLockProofType | Lowercase<keyof typeof AssetLockProofType>
export type PoolingLike = PoolingWASM | keyof typeof PoolingWASM | Lowercase<keyof typeof PoolingWASM>
export type VoteStateResultTypeLike = VoteStateResultType | keyof typeof VoteStateResultType | Lowercase<keyof typeof VoteStateResultType>

export type AddressWitnessP2PKH = protocol.AddressWitnessP2pkhNAPI
export type AddressWitnessP2SH = protocol.AddressWitnessP2shNAPI

export type TokenConfigurationLocalizationJson = protocol.TokenConfigurationLocalizationJsonNAPI

export type DistributionFixedAmount = protocol.DistributionFixedAmountNAPI
export type DistributionRandom = protocol.DistributionRandomNAPI
export type DistributionStepDecreasingAmount = protocol.DistributionStepDecreasingAmountNAPI

export interface DistributionStepwiseStep {
  step: bigint
  amount: bigint
}

export type DistributionStepwise = DistributionStepwiseStep[]
export type DistributionLinear = protocol.DistributionLinearNAPI
export type DistributionPolynomial = protocol.DistributionPolynomialNAPI
export type DistributionExponential = protocol.DistributionExponentialNAPI
export type DistributionLogarithmic = protocol.DistributionLogarithmicNAPI
export type DistributionInvertedLogarithmic = protocol.DistributionInvertedLogarithmicNAPI

export interface RewardDistribution {
  interval: bigint | number
  function: DistributionFunctionWASM
  distributionType: 'BlockBasedDistribution' | 'TimeBasedDistribution' | 'EpochBasedDistribution'
}

export type ISO639_CODES = typeof languageCodes[number]

export interface DataContractTokens {
  position: number
  tokenConfiguration: TokenConfigurationWASM
}

export interface DataContractGroups {
  position: number
  group: GroupWASM
}

export type DocumentTransitionLike =
  DocumentCreateTransitionWASM
  | DocumentDeleteTransitionWASM
  | DocumentPurchaseTransitionWASM
  | DocumentReplaceTransitionWASM
  | DocumentTransferTransitionWASM
  | DocumentUpdatePriceTransitionWASM
export type TokenTransitionLike =
  TokenConfigUpdateTransitionWASM
  | TokenDirectPurchaseTransitionWASM
  | TokenSetPriceForDirectPurchaseTransitionWASM
  | TokenBurnTransitionWASM
  | TokenClaimTransitionWASM
  | TokenDestroyFrozenFundsTransitionWASM
  | TokenEmergencyActionTransitionWASM
  | TokenFreezeTransitionWASM
  | TokenMintTransitionWASM
  | TokenTransferTransitionWASM
  | TokenUnFreezeTransitionWASM

export interface ExtendedEpochInfo {
  index: number
  firstBlockTime: bigint
  firstBlockHeight: bigint
  firstCoreBlockHeight: number
  feeMultiplierPermille: bigint
  protocolVersion: number
}

export interface VerifiedEpochsInfo {
  rootHash: Uint8Array
  epochsInfo: ExtendedEpochInfo[]
}

export interface VerifiedTotalCredits {
  rootHash: Uint8Array
  totalCredits: bigint
}

export interface StartAt {
  startIdentifier: IdentifierLike
  startIdentifierIncluded: boolean
}

export type Winner =
  | undefined
  | NoWinner
  | LockedWinner
  | WonByIdentityWinner

export type WinnerType = 'NoWinner' | 'Locked' | 'WonByIdentity'

export interface NoWinner {
  type: WinnerType
  blockInfo: BlockInfo
}

export interface LockedWinner {
  type: WinnerType
  blockInfo: BlockInfo
}

export interface WonByIdentityWinner {
  type: WinnerType
  identityId: Uint8Array
  blockInfo: BlockInfo
}

export interface BlockInfo {
  height: bigint
  coreHeight: number
  timeMs: bigint
  epoch?: number
}

export interface ContenderWithSerializedDocument {
  identityId: IdentifierWASM
  serializedDocument?: Uint8Array
  voteTally?: number
}

export interface ContestedDocumentVotePollQueryExecutionResult {
  contenders: ContenderWithSerializedDocument[]
  lockedVoteTally?: number
  abstainingVoteTally?: number
  winner?: Winner
  skipped: number
}

export interface VerifiedVoteState {
  rootHash: Uint8Array
  result: ContestedDocumentVotePollQueryExecutionResult
}

export interface VerifiedContract {
  rootHash: Uint8Array
  dataContract?: DataContractWASM
}

export interface IdentityTokenInfo {
  frozen: boolean
}

export interface TokenStatus {
  paused: boolean
}

export interface VerifiedIdentityBalance {
  balance: bigint
  id: IdentifierWASM
}

export interface VerifiedIdentityTokenInfo {
  tokenId: IdentifierWASM
  identityTokenInfo: IdentityTokenInfo
}

export interface VerifiedTokenPricingSchedule {
  tokenId: IdentifierWASM
  pricingSchedule?: TokenPricingScheduleWASM
}

export interface VerifiedBalanceTransfer {
  sender: PartialIdentityWASM
  recipient: PartialIdentityWASM
}

export interface VerifiedDocument {
  id: IdentifierWASM
  document?: DocumentWASM
}

export interface VerifiedTokenGroupActionWithDocument {
  groupSumPower: number
  document?: DocumentWASM
}

export interface VerifiedTokenGroupActionWithTokenBalance {
  groupSumPower: number
  groupActionStatus: string
  amount?: bigint
}

export interface VerifiedTokenGroupActionWithTokenIdentityInfo {
  groupSumPower: number
  groupActionStatus: string
  identityTokenInfo?: IdentityTokenInfo
}

export interface VerifiedTokenGroupActionWithTokenPricingSchedule {
  groupSumPower: number
  groupActionStatus: string
  pricingSchedule?: TokenPricingScheduleWASM
}

export interface VerifiedPlatformAddressInfo {
  address?: PlatformAddressWASM
  nonce?: number
  balance?: bigint
}

export interface VerifiedIdentityFullWithAddressInfos {
  identity: IdentityWASM
  infos: VerifiedPlatformAddressInfo[]
}

export interface VerifiedIdentityWithAddressInfos {
  identity: PartialIdentityWASM
  infos: VerifiedPlatformAddressInfo[]
}

export type VerifiedStateTransitionResultVariants = DataContractWASM
| IdentityWASM
| IdentifierWASM
| VerifiedIdentityBalance
| VerifiedIdentityTokenInfo
| VerifiedTokenPricingSchedule
| TokenStatus
| VerifiedIdentityBalance[]
| PartialIdentityWASM
| VerifiedBalanceTransfer
| VerifiedDocument[]
| DocumentWASM
| VerifiedTokenGroupActionWithDocument
| VerifiedTokenGroupActionWithTokenBalance
| VerifiedTokenGroupActionWithTokenIdentityInfo
| VerifiedTokenGroupActionWithTokenPricingSchedule
| VoteWASM
| VerifiedPlatformAddressInfo[]
| VerifiedIdentityFullWithAddressInfos
| VerifiedIdentityWithAddressInfos

export type VerifiedStateTransitionResultVariantsRAW =
  protocol.DataContractNAPI
  | protocol.IdentityNAPI
  | protocol.IdentifierNAPI
  | protocol.VerifiedIdentityBalanceNAPI
  | protocol.VerifiedIdentityTokenInfoNAPI
  | protocol.VerifiedTokenPricingScheduleNAPI
  | protocol.TokenStatusNAPI
  | protocol.VerifiedIdentityBalanceNAPI[]
  | protocol.PartialIdentityNAPI
  | protocol.VerifiedBalanceTransferNAPI
  | protocol.VerifiedDocumentNAPI[]
  | protocol.DocumentNAPI
  | protocol.VerifiedTokenGroupActionWithDocumentNAPI
  | protocol.VerifiedTokenGroupActionWithTokenBalanceNAPI
  | protocol.VerifiedTokenGroupActionWithTokenIdentityInfoNAPI
  | protocol.VerifiedTokenGroupActionWithTokenPricingScheduleNAPI
  | protocol.VoteNAPI
  | protocol.VerifiedAddressInfosNAPI[]
  | protocol.VerifiedIdentityFullWithAddressInfosNAPI
  | protocol.VerifiedIdentityWithAddressInfosNAPI

export interface VerifiedStateTransitionResult {
  rootHash: Uint8Array
  result: VerifiedStateTransitionResultVariants
}

export type WhereOperator =
  | '='
  | '=='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'Between'
  | 'between'
  | 'BetweenExcludeBounds'
  | 'betweenExcludeBounds'
  | 'betweenexcludebounds'
  | 'between_exclude_bounds'
  | 'BetweenExcludeLeft'
  | 'betweenExcludeLeft'
  | 'betweenexcludeleft'
  | 'between_exclude_left'
  | 'BetweenExcludeRight'
  | 'betweenExcludeRight'
  | 'betweenexcluderight'
  | 'between_exclude_right'
  | 'In'
  | 'in'
  | 'StartsWith'
  | 'startsWith'
  | 'startswith'
  | 'starts_with'

export type WhereClause = [
  field: string,
  operator: WhereOperator,
  value: unknown
]

export interface VerifiedDocuments {
  rootHash: Uint8Array
  documents: DocumentWASM[]
}

export interface VerifiedIdentifierByNonUniquePublicKeyHash {
  rootHash: Uint8Array
  identifier?: IdentifierWASM
}

export interface VerifiedIdentityBalanceRootHash {
  rootHash: Uint8Array
  balance?: bigint
}

export interface VerifiedIdentityByIdentifier {
  rootHash: Uint8Array
  identity?: IdentityWASM
}

export interface VerifiedIdentityByUniqueKeyHash {
  rootHash: Uint8Array
  identity?: IdentityWASM
}

export interface VerifiedIdentityContractNonce {
  rootHash: Uint8Array
  contractNonce?: bigint
}

export interface VerifiedIdentityKeysByIdentifier {
  rootHash: Uint8Array
  identity?: PartialIdentityWASM
}

export interface VerifiedIdentityNonce {
  rootHash: Uint8Array
  nonce?: bigint
}

export interface IdentityTokenBalance {
  balance: bigint
  id: IdentifierWASM
}

export interface IdentityTokenBalanceOptional {
  balance?: bigint
  id: IdentifierWASM
}

export interface VerifiedTokenBalancesForIdentities {
  rootHash: Uint8Array
  balances: IdentityTokenBalanceOptional[]
}

export interface TokenContractInfo {
  contractId: IdentifierWASM
  tokenContractPosition: number
}

export interface VerifiedTokenContractInfo {
  rootHash: Uint8Array
  contractInfo?: TokenContractInfo
}

export interface VerifiedTokenDirectPurchasePrices {
  rootHash: Uint8Array
  prices: VerifiedTokenPricingSchedule[]
}

export interface TotalSingleTokenBalance {
  tokenSupply: bigint
  aggregatedTokenAccountBalances: bigint
}

export interface VerifiedTokenTotalSupply {
  rootHash: Uint8Array
  totalBalance: TotalSingleTokenBalance
}

export interface VerifiedTokensBalancesForIdentity {
  rootHash: Uint8Array
  balances: IdentityTokenBalanceOptional[]
}

export type VerifiedPlatformAddressInfoWithRootHash = VerifiedPlatformAddressInfo & { rootHash: Uint8Array }
