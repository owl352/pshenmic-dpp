import * as DPP from './pshenmic_dpp';

export * from './pshenmic_dpp'

export * from './base122'

export default dpp;

declare const dpp: DashPlatformProtocolWASM;

export class DashPlatformProtocolWASM {
    // CLASSES
    AssetLockProofWASM: DPP.AssetLockProofWASM
    ChainAssetLockProofWASM: DPP.ChainAssetLockProofWASM
    CoreScriptWASM: DPP.CoreScriptWASM
    DataContractCreateTransitionWASM: DPP.DataContractCreateTransitionWASM
    DataContractUpdateTransitionWASM: DPP.DataContractUpdateTransitionWASM
    DataContractWASM: DPP.DataContractWASM
    DocumentBaseTransitionWASM: DPP.DocumentBaseTransitionWASM
    DocumentCreateTransitionWASM: DPP.DocumentCreateTransitionWASM
    DocumentDeleteTransitionWASM: DPP.DocumentDeleteTransitionWASM
    DocumentPurchaseTransitionWASM: DPP.DocumentPurchaseTransitionWASM
    DocumentReplaceTransitionWASM: DPP.DocumentReplaceTransitionWASM
    DocumentTransferTransitionWASM: DPP.DocumentTransferTransitionWASM
    DocumentTransitionWASM: DPP.DocumentTransitionWASM
    DocumentUpdatePriceTransitionWASM: DPP.DocumentUpdatePriceTransitionWASM
    DocumentWASM: DPP.DocumentWASM
    BatchTransitionWASM: DPP.BatchTransitionWASM
    BatchedTransitionWASM: DPP.BatchedTransitionWASM
    TokenTransitionWASM: DPP.TokenTransitionWASM
    TokenBaseTransitionWASM: DPP.TokenBaseTransitionWASM
    TokenPricingScheduleWASM: DPP.TokenPricingScheduleWASM
    TokenConfigUpdateTransitionWASM: DPP.TokenConfigUpdateTransitionWASM
    TokenDirectPurchaseTransitionWASM: DPP.TokenDirectPurchaseTransitionWASM
    TokenSetPriceForDirectPurchaseTransitionWASM: DPP.TokenSetPriceForDirectPurchaseTransitionWASM
    TokenBurnTransitionWASM: DPP.TokenBurnTransitionWASM
    TokenClaimTransitionWASM: DPP.TokenClaimTransitionWASM
    TokenDestroyFrozenFundsTransitionWASM: DPP.TokenDestroyFrozenFundsTransitionWASM
    TokenEmergencyActionTransitionWASM: DPP.TokenEmergencyActionTransitionWASM
    TokenFreezeTransitionWASM: DPP.TokenFreezeTransitionWASM
    TokenMintTransitionWASM: DPP.TokenMintTransitionWASM
    TokenTransferTransitionWASM: DPP.TokenTransferTransitionWASM
    TokenUnFreezeTransitionWASM: DPP.TokenUnFreezeTransitionWASM
    GroupStateTransitionInfoWASM: DPP.GroupStateTransitionInfoWASM
    PrivateEncryptedNoteWASM: DPP.PrivateEncryptedNoteWASM
    SharedEncryptedNoteWASM: DPP.SharedEncryptedNoteWASM
    TokenConfigurationChangeItemWASM: DPP.TokenConfigurationChangeItemWASM
    AuthorizedActionTakersWASM: DPP.AuthorizedActionTakersWASM
    DistributionFunctionWASM: DPP.DistributionFunctionWASM
    TokenDistributionRecipientWASM: DPP.TokenDistributionRecipientWASM
    DistributionFixedAmountWASM: DPP.DistributionFixedAmountWASM
    DistributionRandomWASM: DPP.DistributionRandomWASM
    DistributionStepDecreasingAmountWASM: DPP.DistributionStepDecreasingAmountWASM
    DistributionLinearWASM: DPP.DistributionLinearWASM
    DistributionPolynomialWASM: DPP.DistributionPolynomialWASM
    DistributionExponentialWASM: DPP.DistributionExponentialWASM
    DistributionLogarithmicWASM: DPP.DistributionLogarithmicWASM
    DistributionInvertedLogarithmicWASM: DPP.DistributionInvertedLogarithmicWASM
    TokenConfigurationLocalizationWASM: DPP.TokenConfigurationLocalizationWASM
    TokenPerpetualDistributionWASM: DPP.TokenPerpetualDistributionWASM
    RewardDistributionTypeWASM: DPP.RewardDistributionTypeWASM
    TokenConfigurationConventionWASM: DPP.TokenConfigurationConventionWASM
    TokenTradeModeWASM: DPP.TokenTradeModeWASM
    TokenConfigurationWASM: DPP.TokenConfigurationWASM
    ActionTakerWASM: DPP.ActionTakerWASM
    ChangeControlRulesWASM: DPP.ChangeControlRulesWASM
    TokenDistributionRulesWASM: DPP.TokenDistributionRulesWASM
    GroupWASM: DPP.GroupWASM
    TokenKeepsHistoryRulesWASM: DPP.TokenKeepsHistoryRulesWASM
    TokenMarketplaceRulesWASM: DPP.TokenMarketplaceRulesWASM
    TokenPreProgrammedDistributionWASM: DPP.TokenPreProgrammedDistributionWASM
    IdentifierWASM: DPP.IdentifierWASM
    IdentityCreateTransitionWASM: DPP.IdentityCreateTransitionWASM
    IdentityCreditTransferWASM: DPP.IdentityCreditTransferWASM
    IdentityCreditWithdrawalTransitionWASM: DPP.IdentityCreditWithdrawalTransitionWASM
    IdentityPublicKeyInCreationWASM: DPP.IdentityPublicKeyInCreationWASM
    IdentityPublicKeyWASM: DPP.IdentityPublicKeyWASM
    ContractBoundsWASM: DPP.ContractBoundsWASM
    IdentityTopUpTransitionWASM: DPP.IdentityTopUpTransitionWASM
    IdentityUpdateTransitionWASM: DPP.IdentityUpdateTransitionWASM
    IdentityWASM: DPP.IdentityWASM
    InstantAssetLockProofWASM: DPP.InstantAssetLockProofWASM
    InstantLockWASM: DPP.InstantLockWASM
    OutPointWASM: DPP.OutPointWASM
    PrefundedVotingBalanceWASM: DPP.PrefundedVotingBalanceWASM
    PrivateKeyWASM: DPP.PrivateKeyWASM
    StateTransitionWASM: DPP.StateTransitionWASM
    TxOutWASM: DPP.TxOutWASM
    TxInWASM: DPP.TxInWASM
    WitnessWASM: DPP.WitnessWASM
    TransactionWASM: DPP.TransactionWASM
    MasternodeVoteTransitionWASM: DPP.MasternodeVoteTransitionWASM
    VoteWASM: DPP.VoteWASM
    VotePollWASM: DPP.VotePollWASM
    ResourceVoteChoiceWASM: DPP.ResourceVoteChoiceWASM
    // ENUMS
    AssetLockProofTypeWASM: DPP.AssetLockProofTypeWASM
    BatchType: DPP.BatchType
    KeyType: DPP.KeyType
    NetworkWASM: DPP.NetworkWASM
    PlatformVersionWASM: DPP.PlatformVersionWASM
    PoolingWASM: DPP.PoolingWASM
    Purpose: DPP.Purpose
    SecurityLevel: DPP.SecurityLevel
    ActionGoalWASM: DPP.ActionGoalWASM
    // METHODS
    initSync: Function
    verifyVotePollVoteStateProof: Function
    verifyContract: Function
    verifyDocumentsProof: Function
    verifyIdentifierByNonUniquePublicKeyHash: Function
    verifyIdentityBalance: Function
    verifyIdentityByIdentifier: Function
    verifyIdentityByUniqueKeyHash: Function
    verifyIdentityContractNonce: Function
    verifyIdentityKeysByIdentifier: Function
    verifyIdentityNonce: Function
    verifySignatureDigest: Function
    verifyEpochsInfo: Function
    verifyTotalCredits: Function
    verifyTokenBalancesForIdentities: Function
    verifyTokenContractInfo: Function
    verifyTokenTotalSupply: Function
    verifyTokensBalancesForIdentity: Function
}
