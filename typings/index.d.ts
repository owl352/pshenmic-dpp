import * as DPP from './pshenmic_dpp';

export default DPP;

export class WASM {
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
    DocumentsBatchWASM: typeof DPP.DocumentsBatchWASM
    IdentifierWASM: typeof DPP.IdentifierWASM
    IdentityCreateTransitionWASM: typeof DPP.IdentityCreateTransitionWASM
    IdentityCreditTransferWASM: typeof DPP.IdentityCreditTransferWASM
    IdentityCreditWithdrawalTransitionWASM: typeof DPP.IdentityCreditWithdrawalTransitionWASM
    IdentityPublicKeyInCreationWASM: typeof DPP.IdentityPublicKeyInCreationWASM
    IdentityPublicKeyWASM: typeof DPP.IdentityPublicKeyWASM
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
    // ENUMS
    AssetLockProofTypeWASM: typeof DPP.AssetLockProofTypeWASM
    BatchType: typeof DPP.BatchType
    KeyType: typeof DPP.KeyType
    NetworkWASM: typeof DPP.NetworkWASM
    PlatformVersionWASM: typeof DPP.PlatformVersionWASM
    PoolingWASM: typeof DPP.PoolingWASM
    Purpose: typeof DPP.Purpose
    SecurityLevel: typeof DPP.SecurityLevel
    // METHODS
    cborToObject: typeof DPP.cborToObject
    objectToCbor: typeof DPP.objectToCbor
    initSync: typeof DPP.initSync
}