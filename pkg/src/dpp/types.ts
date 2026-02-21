import * as protocol from '../../binaries/bindingsTypes.js'
import {
  AddressWitnessP2pkhNAPI,
  AddressWitnessP2shNAPI,
  DistributionExponentialNAPI, DistributionFixedAmountNAPI, DistributionInvertedLogarithmicNAPI,
  DistributionLinearNAPI,
  DistributionLogarithmicNAPI, DistributionPolynomialNAPI, DistributionRandomNAPI, DistributionStepDecreasingAmountNAPI,
  IdentifierNAPI, TokenConfigurationLocalizationJsonNAPI
} from '../../binaries/bindingsTypes.js'
import {
  ActionGoal, AssetLockProofType, GasFeesPaidBy,
  KeyType,
  NetworkWASM,
  PlatformVersionWASM, Pooling,
  Purpose,
  SecurityLevel,
  TokenDistributionType, TokenEmergencyAction, VoteStateResultType
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

export type DashPlatformProtocol = typeof protocol
export type IdentifierLike = string | Uint8Array | IdentifierNAPI | IdentifierWASM

export type KeyTypeLike = KeyType | keyof typeof KeyType
export type NetworkLike = NetworkWASM | keyof typeof NetworkWASM
export type SecurityLevelLike = SecurityLevel | keyof typeof SecurityLevel
export type PlatformVersionLike = PlatformVersionWASM | keyof typeof PlatformVersionWASM
export type PurposeLike = Purpose | keyof typeof Purpose
export type ActionGoalLike = ActionGoal | keyof typeof ActionGoal
export type GasFeesPaidByLike = GasFeesPaidBy | keyof typeof GasFeesPaidBy
export type TokenDistributionLike = TokenDistributionType | keyof typeof TokenDistributionType
export type TokenEmergencyActionLike = TokenEmergencyAction | keyof typeof TokenEmergencyAction
export type AssetLockProofTypeLike = AssetLockProofType | keyof typeof AssetLockProofType
export type PoolingLike = Pooling | keyof typeof Pooling
export type VoteStateResultTypeLike = VoteStateResultType | keyof typeof VoteStateResultType

export type EnumLike = KeyTypeLike | NetworkLike | SecurityLevelLike | PlatformVersionLike | PurposeLike

export type AddressWitnessP2PKH = AddressWitnessP2pkhNAPI
export type AddressWitnessP2SH = AddressWitnessP2shNAPI

export type TokenConfigurationLocalizationJson = TokenConfigurationLocalizationJsonNAPI

export type DistributionFixedAmount = DistributionFixedAmountNAPI
export type DistributionRandom = DistributionRandomNAPI
export type DistributionStepDecreasingAmount = DistributionStepDecreasingAmountNAPI
export interface DistributionStepwiseStep {
  step: bigint
  amount: bigint
}
export type DistributionStepwise = DistributionStepwiseStep[]
export type DistributionLinear = DistributionLinearNAPI
export type DistributionPolynomial = DistributionPolynomialNAPI
export type DistributionExponential = DistributionExponentialNAPI
export type DistributionLogarithmic = DistributionLogarithmicNAPI
export type DistributionInvertedLogarithmic = DistributionInvertedLogarithmicNAPI

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

export type DocumentTransitionLike = DocumentCreateTransitionWASM | DocumentDeleteTransitionWASM | DocumentPurchaseTransitionWASM | DocumentReplaceTransitionWASM | DocumentTransferTransitionWASM | DocumentUpdatePriceTransitionWASM
export type TokenTransitionLike = TokenConfigUpdateTransitionWASM | TokenDirectPurchaseTransitionWASM | TokenSetPriceForDirectPurchaseTransitionWASM | TokenBurnTransitionWASM | TokenClaimTransitionWASM | TokenDestroyFrozenFundsTransitionWASM | TokenEmergencyActionTransitionWASM | TokenFreezeTransitionWASM | TokenMintTransitionWASM | TokenTransferTransitionWASM | TokenUnFreezeTransitionWASM

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

export interface NoWinner {
  type: 'NoWinner'
  blockInfo: BlockInfo
}

export interface LockedWinner {
  type: 'Locked'
  blockInfo: BlockInfo
}

export interface WonByIdentityWinner {
  type: 'WonByIdentity'
  identityId: Uint8Array
  blockInfo: BlockInfo
}

export interface BlockInfo {
  height: number
  coreHeight: number
  timeMs: number
  epoch: number
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
  winner: Winner
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
