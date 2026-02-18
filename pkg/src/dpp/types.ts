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
  ActionGoal, AssetLockProofType,
  KeyType,
  NetworkWASM,
  PlatformVersionWASM, Pooling,
  Purpose,
  SecurityLevel,
  TokenDistributionType, TokenEmergencyAction
} from './enums.js'
import { IdentifierWASM } from './structs/Identifier.js'
import { languageCodes } from './constants.js'

export type DashPlatformProtocol = typeof protocol
export type IdentifierLike = string | Uint8Array | IdentifierNAPI | IdentifierWASM

export type KeyTypeLike = KeyType | keyof typeof KeyType
export type NetworkLike = NetworkWASM | keyof typeof NetworkWASM
export type SecurityLevelLike = SecurityLevel | keyof typeof SecurityLevel
export type PlatformVersionLike = PlatformVersionWASM | keyof typeof PlatformVersionWASM
export type PurposeLike = Purpose | keyof typeof Purpose
export type ActionGoalLike = ActionGoal | keyof typeof ActionGoal
export type TokenDistributionLike = TokenDistributionType | keyof typeof TokenDistributionType
export type TokenEmergencyActionLike = TokenEmergencyAction | keyof typeof TokenEmergencyAction
export type AssetLockProofTypeLike = AssetLockProofType | keyof typeof AssetLockProofType
export type PoolingLike = Pooling | keyof typeof Pooling

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

export type ISO639_CODES = typeof languageCodes[number]
