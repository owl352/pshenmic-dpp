___
# PSHENMIC-DPP

## General
Pshenmic-dpp is a package with Rust bindings for JS.

The module uses [rs-dpp](https://github.com/dashpay/platform) (Dash Platform `v5.0.0-rc.2`) and exposes its structures,
state transitions and proof verification to JavaScript/TypeScript via [napi-rs](https://napi.rs).
The same API is available on WebAssembly, Node.js native addons and React Native.

___
## How To Install
`yarn add pshenmic-dpp`

or

`npm i pshenmic-dpp`

___
## Supported Platforms

| Entry point | Environment | Targets |
|---|---|---|
| `pshenmic-dpp/wasm` (`browser` / `default`) | Browsers, bundlers, any JS runtime | `wasm32-wasip1-threads` (via emnapi) |
| `pshenmic-dpp/native` (`node`) | Node.js | `x86_64-unknown-linux-gnu`, `aarch64-unknown-linux-gnu`, `x86_64-unknown-linux-musl`, `aarch64-unknown-linux-musl`, `x86_64-apple-darwin`, `aarch64-apple-darwin`, `x86_64-pc-windows-msvc`, `aarch64-pc-windows-msvc` |
| `react-native` | React Native (via `react-native-node-api`) | `aarch64-linux-android`, `x86_64-linux-android`, `aarch64-apple-ios-sim` |

The root import `pshenmic-dpp` resolves to the right build automatically through the `exports` conditions.

```ts
import { IdentifierWASM } from 'pshenmic-dpp'

const identifier = IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')
console.log(identifier.hex())
```

___
## Current features

### Core
- `IdentifierWASM`
- `IdentityWASM`
- `PartialIdentityWASM`
- `IdentityPublicKeyWASM`
- `IdentityPublicKeyInCreationWASM`
- `PrivateKeyWASM`
- `PublicKeyWASM`
- `CoreScriptWASM`
- `ContractBoundsWASM`
- `ConsensusErrorWASM`
- `StateTransitionWASM`
- `GroupStateTransitionInfoWASM`
- `PrivateEncryptedNoteWASM`
- `SharedEncryptedNoteWASM`
- Enums: `KeyType`, `Purpose`, `SecurityLevel`, `NetworkWASM`, `PlatformVersionWASM`, `ActionGoal`,
  `TokenDistributionType`, `TokenEmergencyActionWASM`, `AssetLockProofType`, `PoolingWASM`, `GasFeesPaidByWASM`,
  `VoteStateResultType`, `ScopeWASM`

### Asset Lock
- `AssetLockProofWASM`
- `ChainAssetLockProofWASM`
- `InstantAssetLockProofWASM`
- `InstantLockWASM`
- `TransactionWASM`
- `TxInWASM`
- `TxOutWASM`
- `OutPointWASM`
- `WitnessWASM`

### Identity Transitions
- `IdentityCreateTransitionWASM`
- `IdentityTopUpTransitionWASM`
- `IdentityUpdateTransitionWASM`
- `IdentityCreditTransferWASM`
- `IdentityCreditWithdrawalTransitionWASM`
- `IdentityKeyLimitsUpdateTransitionWASM`

### Platform Addresses
- `PlatformAddressWASM`
- `AddressWitnessWASM`
- `InputAddressWASM`
- `OutputAddressWASM`
- `OutputAddressNullableCreditsWASM`
- `AddressFundsFeeStrategyStepWASM`
- Address Transitions:
  - `AddressCreditWithdrawalTransitionWASM`
  - `AddressFundingFromAssetLockTransitionWASM`
  - `AddressFundsTransferTransitionWASM`
  - `IdentityCreateFromAddressesTransitionWASM`
  - `IdentityCreditTransferToAddressesTransitionWASM`
  - `IdentityTopUpFromAddressesTransitionWASM`

### Shielded Pool (Orchard)
- `OrchardAddressWASM`, `orchardOvkFromSeed`
- `FullViewingKeyWASM`
- `IncomingViewingKeyWASM`
- `NoteWASM`
- `SpendableNoteWASM`
- `RecoveredNoteWASM`, `recoverNotes`
- `ShieldedMemoWASM`
- `ShieldedOutputWASM`
- `MerklePathWASM`
- `CommitmentTreeWASM`
- `OrchardProverWASM`
- `ShieldedBuilderWASM`
- `ShieldedWithdrawalResultWASM`
- `IdentityCreateFromShieldedPoolResultWASM`
- Shielded Transitions:
  - `ShieldTransitionWASM`
  - `ShieldFromAssetLockTransitionWASM`
  - `ShieldedTransferTransitionWASM`
  - `UnshieldTransitionWASM`
  - `ShieldedWithdrawalTransitionWASM`
  - `IdentityCreateFromShieldedPoolTransitionWASM`
  - `ShieldFromIdentityTransitionWASM`
  - `IdentityTopUpFromShieldedPoolTransitionWASM`
  - `TokenShieldedTransferWithShieldedFeeTransitionWASM`
  - `TokenUnshieldWithShieldedFeeTransitionWASM`
  - `TokenPurchaseFromShieldedPoolTransitionWASM`
  - `SerializedActionWASM`

### Data Contracts & Documents
- `DataContractWASM`
- `DataContractCreateTransitionWASM`
- `DataContractUpdateTransitionWASM`
- `ContractUserModerationTransitionWASM`
- `ContractFeeClaimTransitionWASM`
- `DocumentWASM`

### Batch
- `BatchTransitionWASM`
- `BatchedTransitionWASM`
- `DocumentTransitionWASM`
- `DocumentBaseTransitionWASM`
- `TokenTransitionWASM`
- `TokenBaseTransitionWASM`
- `TokenPaymentInfoWASM`
- `TokenShieldedPaymentWASM`
- `TokenPricingScheduleWASM`
- `PrefundedVotingBalanceWASM`
- Document Transitions:
  - `DocumentCreateTransitionWASM`
  - `DocumentDeleteTransitionWASM`
  - `DocumentIndexOnlyDeleteTransitionWASM`
  - `DocumentPurchaseTransitionWASM`
  - `DocumentReplaceTransitionWASM`
  - `DocumentTransferTransitionWASM`
  - `DocumentUpdatePriceTransitionWASM`
- Token Transitions:
  - `TokenBurnTransitionWASM`
  - `TokenClaimTransitionWASM`
  - `TokenConfigUpdateTransitionWASM`
  - `TokenDestroyFrozenFundsTransitionWASM`
  - `TokenDirectPurchaseTransitionWASM`
  - `TokenEmergencyActionTransitionWASM`
  - `TokenFreezeTransitionWASM`
  - `TokenMintTransitionWASM`
  - `TokenSetPriceForDirectPurchaseTransitionWASM`
  - `TokenTransferTransitionWASM`
  - `TokenUnFreezeTransitionWASM`
  - `TokenShieldTransitionWASM`
  - `TokenUnshieldTransitionWASM`
  - `TokenShieldedTransferTransitionWASM`
  - `TokenMintToPoolTransitionWASM`
  - `TokenBurnFromPoolTransitionWASM`
  - `TokenClaimToPoolTransitionWASM`
  - `TokenDirectPurchaseToPoolTransitionWASM`

### Token Configuration
- `TokenConfigurationWASM`
- `TokenConfigurationChangeItemWASM`
- `TokenConfigurationConventionWASM`
- `TokenConfigurationLocalizationWASM`
- `TokenKeepsHistoryRulesWASM`
- `TokenMarketplaceRulesWASM`
- `TokenTradeModeWASM`
- `TokenDistributionRulesWASM`
- `TokenDistributionRecipientWASM`
- `TokenPerpetualDistributionWASM`
- `TokenPreProgrammedDistributionWASM`
- `RewardDistributionTypeWASM`
- `DistributionFunctionWASM`
- `ActionTakerWASM`
- `AuthorizedActionTakersWASM`
- `ChangeControlRulesWASM`
- `GroupWASM`

### Masternode Voting
- `MasternodeVoteTransitionWASM`
- `VoteWASM`
- `VotePollWASM`
- `ResourceVoteChoiceWASM`

### Proof Verification
- Signatures: `verifySignatureDigest`
- System: `verifyEpochsInfoProof`, `verifyFinalizedEpochInfosProof`, `verifyTotalCreditsProof`
- State transitions: `verifyStateTransitionResult`
- Contracts & documents: `verifyContractProof`, `verifyContractsByRangeProof`, `verifyContractsVersionsProof`,
  `verifyDocumentsProof`, `verifyChainedDocumentsProof`, `verifyCompositeDocumentsProof`, `verifyRankedDocumentsProof`,
  `verifyHavingDocumentsProof`
- Contract groups: `verifyContractGroupInfoProof`, `verifyContractGroupMembersProof`,
  `verifyContractGroupMembershipsForContractProof`
- Contract moderation: `verifyContractModerationStatusProof`, `verifyContractModerationEntriesProof`,
  `verifyContractModerationActionCountsProof`, `verifyContractDocumentRemovalsProof`, `verifyContractFeePotsProof`,
  `verifyContractTeamActionsProof`, `verifyContractTeamActionSignersProof`, `verifyContractTeamActionSignatureProof`
- Contested resources: `verifyVotePollVoteStateProof`
- Identity: `verifyIdentityByIdentifierProof`, `verifyIdentityByUniqueKeyHashProof`,
  `verifyIdentifierByNonUniquePublicKeyHashProof`, `verifyFullIdentityByNonUniquePublicKeyHashProof`,
  `verifyFullIdentityByNonUniquePublicKeyHashTwoProofs`, `verifyIdentityBalanceProof`, `verifyIdentityKeysByIdentifierProof`,
  `verifyIdentityNonceProof`, `verifyIdentityContractNonceProof`, `verifyIdentityKeysRemainingBudgetsProof`
- Tokens: `verifyTokenBalancesForIdentitiesProof`, `verifyTokensBalancesForIdentityProof`, `verifyTokenContractInfoProof`,
  `verifyTokenDirectPurchasePrices`, `verifyTokenTotalSupplyProof`
- Platform addresses: `verifyPlatformAddressInfo`, `verifyPlatformAddressesInfos`, `verifyAddressesTrunkState`,
  `verifyAddressesBranchState`, `verifyRecentAddressBalanceChanges`, `verifyRecentCompactedAddressBalanceChanges`
- Shielded pool: `verifyShieldedPoolStateProof`, `verifyShieldedAnchorsProof`, `verifyMostRecentShieldedAnchorProof`,
  `verifyShieldedEncryptedNotesProof`, `verifyShieldedNotesCountProof`, `verifyShieldedNullifiersProof`

### Utils (`pshenmic-dpp/wasm/utils`)
- `valueToDynamicValue`, `valueFromDynamicValue`
- `prepareIdentifierValue`, `preparePlatformAddressValue`
