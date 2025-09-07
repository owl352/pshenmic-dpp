import * as DPP from './pshenmic_dpp';

export * from './pshenmic_dpp'

export * from './base122'

export default dpp;

declare const dpp: DashPlatformProtocolWASM;

export class DashPlatformProtocolWASM {
    // CLASSES
    AssetLockProofWASM: typeof DPP.AssetLockProofWASM
    ChainAssetLockProofWASM: typeof DPP.ChainAssetLockProofWASM
    CoreScriptWASM: typeof DPP.CoreScriptWASM
    DataContractCreateTransitionWASM: typeof DPP.DataContractCreateTransitionWASM
    DataContractUpdateTransitionWASM: typeof DPP.DataContractUpdateTransitionWASM
    DataContractWASM: typeof DPP.DataContractWASM
    DocumentBaseTransitionWASM: typeof DPP.DocumentBaseTransitionWASM
    DocumentCreateTransitionWASM: typeof DPP.DocumentCreateTransitionWASM
    DocumentDeleteTransitionWASM: typeof DPP.DocumentDeleteTransitionWASM
    DocumentPurchaseTransitionWASM: typeof DPP.DocumentPurchaseTransitionWASM
    DocumentReplaceTransitionWASM: typeof DPP.DocumentReplaceTransitionWASM
    DocumentTransferTransitionWASM: typeof DPP.DocumentTransferTransitionWASM
    DocumentTransitionWASM: typeof DPP.DocumentTransitionWASM
    DocumentUpdatePriceTransitionWASM: typeof DPP.DocumentUpdatePriceTransitionWASM
    DocumentWASM: typeof DPP.DocumentWASM
    BatchTransitionWASM: typeof DPP.BatchTransitionWASM
    BatchedTransitionWASM: typeof DPP.BatchedTransitionWASM
    TokenTransitionWASM: typeof DPP.TokenTransitionWASM
    TokenBaseTransitionWASM: typeof DPP.TokenBaseTransitionWASM
    TokenPricingScheduleWASM: typeof DPP.TokenPricingScheduleWASM
    TokenConfigUpdateTransitionWASM: typeof DPP.TokenConfigUpdateTransitionWASM
    TokenDirectPurchaseTransitionWASM: typeof DPP.TokenDirectPurchaseTransitionWASM
    TokenSetPriceForDirectPurchaseTransitionWASM: typeof DPP.TokenSetPriceForDirectPurchaseTransitionWASM
    TokenBurnTransitionWASM: typeof DPP.TokenBurnTransitionWASM
    TokenClaimTransitionWASM: typeof DPP.TokenClaimTransitionWASM
    TokenDestroyFrozenFundsTransitionWASM: typeof DPP.TokenDestroyFrozenFundsTransitionWASM
    TokenEmergencyActionTransitionWASM: typeof DPP.TokenEmergencyActionTransitionWASM
    TokenFreezeTransitionWASM: typeof DPP.TokenFreezeTransitionWASM
    TokenMintTransitionWASM: typeof DPP.TokenMintTransitionWASM
    TokenTransferTransitionWASM: typeof DPP.TokenTransferTransitionWASM
    TokenUnFreezeTransitionWASM: typeof DPP.TokenUnFreezeTransitionWASM
    GroupStateTransitionInfoWASM: typeof DPP.GroupStateTransitionInfoWASM
    PrivateEncryptedNoteWASM: typeof DPP.PrivateEncryptedNoteWASM
    SharedEncryptedNoteWASM: typeof DPP.SharedEncryptedNoteWASM
    TokenConfigurationChangeItemWASM: typeof DPP.TokenConfigurationChangeItemWASM
    AuthorizedActionTakersWASM: typeof DPP.AuthorizedActionTakersWASM
    DistributionFunctionWASM: typeof DPP.DistributionFunctionWASM
    TokenDistributionRecipientWASM: typeof DPP.TokenDistributionRecipientWASM
    DistributionFixedAmountWASM: typeof DPP.DistributionFixedAmountWASM
    DistributionRandomWASM: typeof DPP.DistributionRandomWASM
    DistributionStepDecreasingAmountWASM: typeof DPP.DistributionStepDecreasingAmountWASM
    DistributionLinearWASM: typeof DPP.DistributionLinearWASM
    DistributionPolynomialWASM: typeof DPP.DistributionPolynomialWASM
    DistributionExponentialWASM: typeof DPP.DistributionExponentialWASM
    DistributionLogarithmicWASM: typeof DPP.DistributionLogarithmicWASM
    DistributionInvertedLogarithmicWASM: typeof DPP.DistributionInvertedLogarithmicWASM
    TokenConfigurationLocalizationWASM: typeof DPP.TokenConfigurationLocalizationWASM
    TokenPerpetualDistributionWASM: typeof DPP.TokenPerpetualDistributionWASM
    RewardDistributionTypeWASM: typeof DPP.RewardDistributionTypeWASM
    TokenConfigurationConventionWASM: typeof DPP.TokenConfigurationConventionWASM
    TokenTradeModeWASM: typeof DPP.TokenTradeModeWASM
    TokenConfigurationWASM: typeof DPP.TokenConfigurationWASM
    ActionTakerWASM: typeof DPP.ActionTakerWASM
    ChangeControlRulesWASM: typeof DPP.ChangeControlRulesWASM
    TokenDistributionRulesWASM: typeof DPP.TokenDistributionRulesWASM
    GroupWASM: typeof DPP.GroupWASM
    TokenKeepsHistoryRulesWASM: typeof DPP.TokenKeepsHistoryRulesWASM
    TokenMarketplaceRulesWASM: typeof DPP.TokenMarketplaceRulesWASM
    TokenPreProgrammedDistributionWASM: typeof DPP.TokenPreProgrammedDistributionWASM
    IdentifierWASM: typeof DPP.IdentifierWASM
    IdentityCreateTransitionWASM: typeof DPP.IdentityCreateTransitionWASM
    IdentityCreditTransferWASM: typeof DPP.IdentityCreditTransferWASM
    IdentityCreditWithdrawalTransitionWASM: typeof DPP.IdentityCreditWithdrawalTransitionWASM
    IdentityPublicKeyInCreationWASM: typeof DPP.IdentityPublicKeyInCreationWASM
    IdentityPublicKeyWASM: typeof DPP.IdentityPublicKeyWASM
    ContractBoundsWASM: typeof DPP.ContractBoundsWASM
    IdentityTopUpTransitionWASM: typeof DPP.IdentityTopUpTransitionWASM
    IdentityUpdateTransitionWASM: typeof DPP.IdentityUpdateTransitionWASM
    IdentityWASM: typeof DPP.IdentityWASM
    InstantAssetLockProofWASM: typeof DPP.InstantAssetLockProofWASM
    InstantLockWASM: typeof DPP.InstantLockWASM
    OutPointWASM: typeof DPP.OutPointWASM
    PrefundedVotingBalanceWASM: typeof DPP.PrefundedVotingBalanceWASM
    PrivateKeyWASM: typeof DPP.PrivateKeyWASM
    StateTransitionWASM: typeof DPP.StateTransitionWASM
    TxOutWASM: typeof DPP.TxOutWASM
    MasternodeVoteTransitionWASM: typeof DPP.MasternodeVoteTransitionWASM
    VoteWASM: typeof DPP.VoteWASM
    VotePollWASM: typeof DPP.VotePollWASM
    ResourceVoteChoiceWASM: typeof DPP.ResourceVoteChoiceWASM
    // ENUMS
    AssetLockProofTypeWASM: typeof DPP.AssetLockProofTypeWASM
    BatchType: typeof DPP.BatchType
    KeyType: typeof DPP.KeyType
    NetworkWASM: typeof DPP.NetworkWASM
    PlatformVersionWASM: typeof DPP.PlatformVersionWASM
    PoolingWASM: typeof DPP.PoolingWASM
    Purpose: typeof DPP.Purpose
    SecurityLevel: typeof DPP.SecurityLevel
    ActionGoalWASM: typeof DPP.ActionGoalWASM
    // METHODS
    initSync: typeof DPP.initSync
    verifyVotePollVoteStateProof: typeof DPP.verifyVotePollVoteStateProof
    verifyContract: typeof DPP.verifyContractProof
    verifyDocumentsProof: typeof DPP.verifyDocumentsProof
    verifyIdentifierByNonUniquePublicKeyHash: typeof DPP.verifyIdentifierByNonUniquePublicKeyHashProof
    verifyIdentityBalance: typeof DPP.verifyIdentityBalanceProof
    verifyIdentityByIdentifier: typeof DPP.verifyIdentityByIdentifierProof
    verifyIdentityByUniqueKeyHash: typeof DPP.verifyIdentityByUniqueKeyHashProof
    verifyIdentityContractNonce: typeof DPP.verifyIdentityContractNonceProof
    verifyIdentityKeysByIdentifier: typeof DPP.verifyIdentityKeysByIdentifierProof
    verifyIdentityNonce: typeof DPP.verifyIdentityNonceProof
    verifySignatureDigest: typeof DPP.verifySignatureDigest
    verifyEpochsInfo: typeof DPP.verifyEpochsInfoProof
    verifyTotalCredits: typeof DPP.verifyTotalCreditsProof
    verifyTokenBalancesForIdentities: typeof DPP.verifyTokenBalancesForIdentitiesProof
    verifyTokenContractInfo: typeof DPP.verifyTokenContractInfoProof
    verifyTokenTotalSupply: typeof DPP.verifyTokenTotalSupplyProof
    verifyTokensBalancesForIdentity: typeof DPP.verifyTokensBalancesForIdentityProof
}
