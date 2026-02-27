export var ActionGoalNAPI;
(function (ActionGoalNAPI) {
    ActionGoalNAPI[ActionGoalNAPI["ActionCompletion"] = 0] = "ActionCompletion";
    ActionGoalNAPI[ActionGoalNAPI["ActionParticipation"] = 1] = "ActionParticipation";
})(ActionGoalNAPI || (ActionGoalNAPI = {}));
export var AssetLockProofTypeNAPI;
(function (AssetLockProofTypeNAPI) {
    AssetLockProofTypeNAPI[AssetLockProofTypeNAPI["Instant"] = 0] = "Instant";
    AssetLockProofTypeNAPI[AssetLockProofTypeNAPI["Chain"] = 1] = "Chain";
})(AssetLockProofTypeNAPI || (AssetLockProofTypeNAPI = {}));
export var BatchTypeNAPI;
(function (BatchTypeNAPI) {
    BatchTypeNAPI[BatchTypeNAPI["Create"] = 0] = "Create";
    BatchTypeNAPI[BatchTypeNAPI["Replace"] = 1] = "Replace";
    BatchTypeNAPI[BatchTypeNAPI["Delete"] = 2] = "Delete";
    BatchTypeNAPI[BatchTypeNAPI["Transfer"] = 3] = "Transfer";
    BatchTypeNAPI[BatchTypeNAPI["Purchase"] = 4] = "Purchase";
    BatchTypeNAPI[BatchTypeNAPI["UpdatePrice"] = 5] = "UpdatePrice";
    BatchTypeNAPI[BatchTypeNAPI["IgnoreWhileBumpingRevision"] = 6] = "IgnoreWhileBumpingRevision";
})(BatchTypeNAPI || (BatchTypeNAPI = {}));
export var GasFeesPaidByNAPI;
(function (GasFeesPaidByNAPI) {
    GasFeesPaidByNAPI[GasFeesPaidByNAPI["DocumentOwner"] = 0] = "DocumentOwner";
    GasFeesPaidByNAPI[GasFeesPaidByNAPI["ContractOwner"] = 1] = "ContractOwner";
    GasFeesPaidByNAPI[GasFeesPaidByNAPI["PreferContractOwner"] = 2] = "PreferContractOwner";
})(GasFeesPaidByNAPI || (GasFeesPaidByNAPI = {}));
export var GroupActionStatusNAPI;
(function (GroupActionStatusNAPI) {
    GroupActionStatusNAPI[GroupActionStatusNAPI["ActionActive"] = 0] = "ActionActive";
    GroupActionStatusNAPI[GroupActionStatusNAPI["ActionClosed"] = 1] = "ActionClosed";
})(GroupActionStatusNAPI || (GroupActionStatusNAPI = {}));
export var KeyTypeNAPI;
(function (KeyTypeNAPI) {
    KeyTypeNAPI[KeyTypeNAPI["ECDSA_SECP256K1"] = 0] = "ECDSA_SECP256K1";
    KeyTypeNAPI[KeyTypeNAPI["BLS12_381"] = 1] = "BLS12_381";
    KeyTypeNAPI[KeyTypeNAPI["ECDSA_HASH160"] = 2] = "ECDSA_HASH160";
    KeyTypeNAPI[KeyTypeNAPI["BIP13_SCRIPT_HASH"] = 3] = "BIP13_SCRIPT_HASH";
    KeyTypeNAPI[KeyTypeNAPI["EDDSA_25519_HASH160"] = 4] = "EDDSA_25519_HASH160";
})(KeyTypeNAPI || (KeyTypeNAPI = {}));
export var NetworkNAPI;
(function (NetworkNAPI) {
    NetworkNAPI[NetworkNAPI["Mainnet"] = 0] = "Mainnet";
    NetworkNAPI[NetworkNAPI["Testnet"] = 1] = "Testnet";
    NetworkNAPI[NetworkNAPI["Devnet"] = 2] = "Devnet";
    NetworkNAPI[NetworkNAPI["Regtest"] = 3] = "Regtest";
})(NetworkNAPI || (NetworkNAPI = {}));
export var PlatformVersionNAPI;
(function (PlatformVersionNAPI) {
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V1"] = 1] = "PLATFORM_V1";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V2"] = 2] = "PLATFORM_V2";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V3"] = 3] = "PLATFORM_V3";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V4"] = 4] = "PLATFORM_V4";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V5"] = 5] = "PLATFORM_V5";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V6"] = 6] = "PLATFORM_V6";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V7"] = 7] = "PLATFORM_V7";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V8"] = 8] = "PLATFORM_V8";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V9"] = 9] = "PLATFORM_V9";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V10"] = 10] = "PLATFORM_V10";
    PlatformVersionNAPI[PlatformVersionNAPI["PLATFORM_V11"] = 11] = "PLATFORM_V11";
})(PlatformVersionNAPI || (PlatformVersionNAPI = {}));
export var PoolingNAPI;
(function (PoolingNAPI) {
    PoolingNAPI[PoolingNAPI["Never"] = 0] = "Never";
    PoolingNAPI[PoolingNAPI["IfAvailable"] = 1] = "IfAvailable";
    PoolingNAPI[PoolingNAPI["Standard"] = 2] = "Standard";
})(PoolingNAPI || (PoolingNAPI = {}));
export var PurposeNAPI;
(function (PurposeNAPI) {
    PurposeNAPI[PurposeNAPI["AUTHENTICATION"] = 0] = "AUTHENTICATION";
    PurposeNAPI[PurposeNAPI["ENCRYPTION"] = 1] = "ENCRYPTION";
    PurposeNAPI[PurposeNAPI["DECRYPTION"] = 2] = "DECRYPTION";
    PurposeNAPI[PurposeNAPI["TRANSFER"] = 3] = "TRANSFER";
    PurposeNAPI[PurposeNAPI["SYSTEM"] = 4] = "SYSTEM";
    PurposeNAPI[PurposeNAPI["VOTING"] = 5] = "VOTING";
    PurposeNAPI[PurposeNAPI["OWNER"] = 6] = "OWNER";
})(PurposeNAPI || (PurposeNAPI = {}));
export var SecurityLevelNAPI;
(function (SecurityLevelNAPI) {
    SecurityLevelNAPI[SecurityLevelNAPI["MASTER"] = 0] = "MASTER";
    SecurityLevelNAPI[SecurityLevelNAPI["CRITICAL"] = 1] = "CRITICAL";
    SecurityLevelNAPI[SecurityLevelNAPI["HIGH"] = 2] = "HIGH";
    SecurityLevelNAPI[SecurityLevelNAPI["MEDIUM"] = 3] = "MEDIUM";
})(SecurityLevelNAPI || (SecurityLevelNAPI = {}));
export var TokenDistributionTypeNAPI;
(function (TokenDistributionTypeNAPI) {
    TokenDistributionTypeNAPI[TokenDistributionTypeNAPI["PreProgrammed"] = 0] = "PreProgrammed";
    TokenDistributionTypeNAPI[TokenDistributionTypeNAPI["Perpetual"] = 1] = "Perpetual";
})(TokenDistributionTypeNAPI || (TokenDistributionTypeNAPI = {}));
export var TokenEmergencyActionNAPI;
(function (TokenEmergencyActionNAPI) {
    TokenEmergencyActionNAPI[TokenEmergencyActionNAPI["Pause"] = 0] = "Pause";
    TokenEmergencyActionNAPI[TokenEmergencyActionNAPI["Resume"] = 1] = "Resume";
})(TokenEmergencyActionNAPI || (TokenEmergencyActionNAPI = {}));
export var VoteStateResultTypeNAPI;
(function (VoteStateResultTypeNAPI) {
    VoteStateResultTypeNAPI[VoteStateResultTypeNAPI["DOCUMENTS"] = 0] = "DOCUMENTS";
    VoteStateResultTypeNAPI[VoteStateResultTypeNAPI["VOTE_TALLY"] = 1] = "VOTE_TALLY";
    VoteStateResultTypeNAPI[VoteStateResultTypeNAPI["DOCUMENTS_AND_VOTE_TALLY"] = 2] = "DOCUMENTS_AND_VOTE_TALLY";
})(VoteStateResultTypeNAPI || (VoteStateResultTypeNAPI = {}));
