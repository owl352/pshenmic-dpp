import { WASI } from '@tybys/wasm-util';
import { getDefaultContext } from '@emnapi/runtime';
import { instantiateNapiModuleSync } from '@emnapi/core';
import { bytes } from './wasm/wasmBytes.js';
import { decode } from '../utils/base122.js';
import { decompressSync } from 'fflate';
const wasmBytes = new Uint8Array(decode(bytes));
const wasi = new WASI({
    version: 'preview1',
    print: function () {
        console.log.apply(console, arguments);
    },
    printErr: function () {
        console.error.apply(console, arguments);
    }
});
const emnapiContext = getDefaultContext();
emnapiContext.feature.supportNewFunction = false;
emnapiContext.feature.supportBigInt = false;
const __sharedMemory = new WebAssembly.Memory({
    initial: 1000,
    maximum: 2000,
    shared: true
});
const wasm = instantiateNapiModuleSync(decompressSync(wasmBytes), {
    context: emnapiContext,
    wasi,
    overwriteImports(importObject) {
        importObject.env = {
            ...importObject.env,
            ...importObject.napi,
            ...importObject.emnapi,
            memory: __sharedMemory
        };
    },
    beforeInit({ instance }) {
        for (const name of Object.keys(instance.exports)) {
            if (name.startsWith('__napi_register__')) {
                instance.exports[name]();
            }
        }
    }
});
export const { verifyContractProof, verifyDocumentsProof, verifyEpochsInfoProof, verifyIdentifierByNonUniquePublicKeyHashProof, verifyIdentityBalanceProof, verifyIdentityByIdentifierProof, verifyIdentityByUniqueKeyHashProof, verifyIdentityContractNonceProof, verifyIdentityKeysByIdentifierProof, verifyIdentityNonceProof, verifySignatureDigest, verifyStateTransitionResult, verifyTokenBalancesForIdentitiesProof, verifyTokenContractInfoProof, verifyTokenDirectPurchasePrices, verifyTokensBalancesForIdentityProof, verifyTokenTotalSupplyProof, verifyTotalCreditsProof, verifyVotePollVoteStateProof, ActionTakerNAPI, AddressCreditWithdrawalTransitionNAPI, AddressFundingFromAssetLockTransitionNAPI, AddressFundsFeeStrategyStepNAPI, AddressFundsTransferTransitionNAPI, AddressWitnessNAPI, AssetLockProofNAPI, AuthorizedActionTakersNAPI, BatchedTransitionNAPI, BatchTransitionNAPI, BlockBasedDistributionNAPI, BlockInfoNAPI, ChainAssetLockProofNAPI, ChangeControlRulesNAPI, ConsensusErrorNAPI, ContenderWithSerializedDocumentNAPI, ContestedDocumentVotePollQueryExecutionResultNAPI, ContractBoundsNAPI, CoreScriptNAPI, DataContractCreateTransitionNAPI, DataContractNAPI, DataContractUpdateTransitionNAPI, DistributionFunctionNAPI, DocumentBaseTransitionNAPI, DocumentCreateTransitionNAPI, DocumentDeleteTransitionNAPI, DocumentNAPI, DocumentPurchaseTransitionNAPI, DocumentReplaceTransitionNAPI, DocumentTransferTransitionNAPI, DocumentTransitionNAPI, DocumentUpdatePriceTransitionNAPI, DynamicValue, EpochBasedDistributionNAPI, ExtendedEpochInfoNAPI, GroupNAPI, GroupStateTransitionInfoNAPI, IdentifierNAPI, IdentityCreateFromAddressesTransitionNAPI, IdentityCreateTransitionNAPI, IdentityCreditTransferNAPI, IdentityCreditTransferToAddressesTransitionNAPI, IdentityCreditWithdrawalTransitionNAPI, IdentityNAPI, IdentityPublicKeyInCreationNAPI, IdentityPublicKeyNAPI, IdentityTokenBalanceNAPI, IdentityTokenBalanceOptionalNAPI, IdentityTokenInfoNAPI, IdentityTopUpFromAddressesTransitionNAPI, IdentityTopUpTransitionNAPI, IdentityUpdateTransitionNAPI, InputAddressNAPI, InstantAssetLockProofNAPI, InstantLockNAPI, MasternodeVoteTransitionNAPI, OutPointNAPI, OutputAddressNAPI, OutputAddressNullableCreditsNAPI, PartialIdentityNAPI, PlatformAddressNAPI, PrefundedVotingBalanceNAPI, PrivateEncryptedNoteNAPI, PrivateKeyNAPI, PublicKeyNAPI, ResourceVoteChoiceNAPI, RewardDistributionTypeNAPI, SharedEncryptedNoteNAPI, StateTransitionNAPI, TimeBasedDistributionNAPI, TokenBaseTransitionNAPI, TokenBurnTransitionNAPI, TokenClaimTransitionNAPI, TokenConfigUpdateTransitionNAPI, TokenConfigurationChangeItemNAPI, TokenConfigurationConventionNAPI, TokenConfigurationLocalizationNAPI, TokenConfigurationNAPI, TokenContractInfoNAPI, TokenDestroyFrozenFundsTransitionNAPI, TokenDirectPurchaseTransitionNAPI, TokenDistributionRecipientNAPI, TokenDistributionRulesNAPI, TokenEmergencyActionTransitionNAPI, TokenFreezeTransitionNAPI, TokenKeepsHistoryRulesNAPI, TokenMarketplaceRulesNAPI, TokenMintTransitionNAPI, TokenPaymentInfoNAPI, TokenPerpetualDistributionNAPI, TokenPreProgrammedDistributionNAPI, TokenPricingScheduleNAPI, TokenSetPriceForDirectPurchaseTransitionNAPI, TokenStatusNAPI, TokenTradeModeNAPI, TokenTransferTransitionNAPI, TokenTransitionNAPI, TokenUnFreezeTransitionNAPI, TotalSingleTokenBalanceNAPI, TransactionNAPI, TxInNAPI, TxOutNAPI, VerifiedAddressInfosNAPI, VerifiedBalanceTransferNAPI, VerifiedContractNAPI, VerifiedDocumentNAPI, VerifiedDocumentsNAPI, VerifiedEpochsInfoNAPI, VerifiedIdentifierByNonUniquePublicKeyHashNAPI, VerifiedIdentityBalanceRootHashNAPI, VerifiedIdentityByIdentifierNAPI, VerifiedIdentityByUniqueKeyHashNAPI, VerifiedIdentityContractNonceNAPI, VerifiedIdentityFullWithAddressInfosNAPI, VerifiedIdentityKeysByIdentifierNAPI, VerifiedIdentityNonceNAPI, VerifiedIdentityTokenInfoNAPI, VerifiedIdentityWithAddressInfosNAPI, VerifiedStateTransitionResultNAPI, VerifiedTokenBalancesForIdentitiesNAPI, VerifiedTokenContractInfoNAPI, VerifiedTokenDirectPurchasePricesNAPI, VerifiedTokenGroupActionWithDocumentNAPI, VerifiedTokenGroupActionWithTokenBalanceNAPI, VerifiedTokenGroupActionWithTokenIdentityInfoNAPI, VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, VerifiedTokenPricingScheduleNAPI, VerifiedTokensBalancesForIdentityNAPI, VerifiedTokenTotalSupplyNAPI, VerifiedTotalCreditsNAPI, VerifiedVoteStateNAPI, VoteNAPI, VotePollNAPI, WitnessNAPI, ActionGoalNAPI, AssetLockProofTypeNAPI, BatchTypeNAPI, GasFeesPaidByNAPI, GroupActionStatusNAPI, KeyTypeNAPI, NetworkNAPI, PlatformVersionNAPI, PoolingNAPI, PurposeNAPI, SecurityLevelNAPI, TokenDistributionTypeNAPI, TokenEmergencyActionNAPI, VoteStateResultTypeNAPI } = wasm.napiModule.exports;
