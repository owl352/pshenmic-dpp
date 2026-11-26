___
# PSHENMIC-DPP

## General
Pshenmic-dpp is a package with Rust bindings for JS.

The module uses [rs-dpp](https://github.com/dashpay/platform) (Dash Platform `v5.1.0-rc.1`, protocol version 15) and exposes its structures,
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
| `pshenmic-dpp/wasm` (`browser` / `default`) | Browsers, bundlers, any JS runtime | `wasm32-wasip1` base, loaded synchronously at import (via emnapi). Shielded proving is the separate `dash-platform-shielded` package. |
| `pshenmic-dpp/native` (`node`) | Node.js | `x86_64-unknown-linux-gnu`, `aarch64-unknown-linux-gnu`, `x86_64-unknown-linux-musl`, `aarch64-unknown-linux-musl`, `x86_64-apple-darwin`, `aarch64-apple-darwin`, `x86_64-pc-windows-msvc`, `aarch64-pc-windows-msvc` |
| `react-native` | React Native (via `react-native-node-api`) | `aarch64-linux-android`, `x86_64-linux-android`, `aarch64-apple-ios-sim` |

The root import `pshenmic-dpp` resolves to the right build automatically through the `exports` conditions.

```ts
import { IdentifierWASM } from 'pshenmic-dpp'

const identifier = IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')
console.log(identifier.hex())
```

___
## Shielded proving / cross-origin isolation

The browser build ships as **two packages**:

- **`pshenmic-dpp`** — the base (`wasm32-wasip1`, non-threaded), loaded
  synchronously at import. All core APIs (identifiers, identities, contracts,
  documents, transitions, proof verification, ...) work in any browser context,
  **without** cross-origin isolation. dpp itself contains no proving code.
- **`dash-platform-shielded`** *(optional)* — the Orchard/Halo 2 proving stack, shipped
  entirely by the separate
  [`dash-platform-shielded`](https://github.com/owl352/dash-platform-shielded) package/repo as
  **native Node-API addons** (preferred on Node, ~3x faster proving) plus a
  threaded wasm module (`wasm32-wasip1-threads`) for browsers / fallback. It is a
  completely independent module: create `new DashPlatformShielded()` and pass the
  instance to the SDK. Importing the package alone does not load anything;
  construction does. The wasm path needs `SharedArrayBuffer` and wasm thread
  workers, i.e. cross-origin isolation in browsers.

### Connect-only sites (no proving)

Drop the `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers
entirely. The base module loads synchronously at import and cross-origin popup
references (e.g. wallet-extension connection popups) keep working — this is the
[_dash-platform-extension#219_](https://github.com/dashpay/dash-platform-extension/issues/219)
fix. Proving APIs load when the `dash-platform-shielded` entry is imported (use
`dash-platform-shielded/lazy` when the shielded import must happen before isolation is
available).

### Proving sites

Serve the page with:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Only `COOP: same-origin` (with a compatible COEP) grants `crossOriginIsolated`
and `SharedArrayBuffer`. `COOP: same-origin-allow-popups` does **not** —
verified in Chrome, Firefox and the HTML spec — so it cannot be used for
proving pages.

**Platform constraint:** `COOP: same-origin` severs the opener's reference to
cross-origin popups: `popup.closed` reads `true` while the popup is still open,
and `window.opener` becomes `null` inside the popup. A proving page therefore
cannot drive a cross-origin wallet popup through `window.open` references. If
you need both proving and wallet popups, use extension messaging or run the
wallet flow in a non-isolated popup context.

### Usage

```sh
npm i pshenmic-dpp dash-platform-shielded   # shielded is optional
```

`pshenmic-dpp` is base-only and contains no shielded code. If an application
needs shielded proving, install `dash-platform-shielded`, create an instance, and
pass it to the SDK:

```ts
import { DashPlatformShielded } from 'dash-platform-shielded'
import { DashPlatformSDK } from 'dash-platform-sdk'

const sdk = new DashPlatformSDK({
  network: 'mainnet',
  shielded: new DashPlatformShielded()
})

const builder = await sdk.shielded.init()
```

Constructing the instance loads the proving module (native addon on Node,
threaded wasm in the browser — the latter needs the isolation headers above).
Importing `dash-platform-shielded` alone does not load anything.

Without cross-origin isolation the browser wasm path fails with a
`SharedArrayBuffer` error. Connect-only consumers never install the shielded
package and keep the base dpp entry with no isolation headers.

> **Shielded proving:** the proving classes (Orchard data, builder/prover,
> commitment tree) live in `dash-platform-shielded`; install it, pass a
> `new DashPlatformShielded()` instance to the SDK, and use the shielded
> controller. The dependency-free shielded wrappers (`ShieldedMemoWASM`, the
> shield/transfer/unshield/token-pool transition classes and the shielded proof
> verifiers) remain exported by `pshenmic-dpp`.

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
The proving classes below live in the separate `dash-platform-shielded` package.
Create `new DashPlatformShielded()` and pass it to the SDK; the browser wasm path
needs isolation — see
[Shielded proving / cross-origin isolation](#shielded-proving--cross-origin-isolation).

`pshenmic-dpp` still exports the dependency-free data side: `ShieldedMemoWASM`,
`ShieldTransitionWASM`, `ShieldedTransferTransitionWASM`, `UnshieldTransitionWASM`,
`ShieldFromAssetLockTransitionWASM`, `ShieldFromIdentityTransitionWASM`,
`ShieldedWithdrawalTransitionWASM`, the identity/token shielded-pool transition
classes, `PrivateDocumentCreateFromShieldedPoolTransitionWASM`, and the
`verifyShielded*Proof` functions.
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
- System: `verifyEpochsInfoProof`, `verifyFinalizedEpochInfosProof`, `verifyTotalCreditsProof`, `verifyPathElementsProof`
- State transitions: `verifyStateTransitionResult`
- Contracts & documents: `verifyContractProof`, `verifyContractsByRangeProof`, `verifyContractsVersionsProof`,
  `verifyDocumentsProof`, `verifyChainedDocumentsProof`, `verifyCompositeDocumentsProof`, `verifyRankedDocumentsProof`,
  `verifyHavingDocumentsProof`
- Contract groups: `verifyContractGroupInfoProof`, `verifyContractGroupMembersProof`,
  `verifyContractGroupMembershipsForContractProof`
- Contract moderation: `verifyContractModerationStatusProof`, `verifyContractModerationEntriesProof`,
  `verifyContractModerationActionCountsProof`, `verifyContractDocumentRemovalsProof`, `verifyContractFeePotsProof`,
  `verifyContractTeamActionsProof`, `verifyContractTeamActionSignersProof`, `verifyContractTeamActionSignatureProof`
- Contested resources: `verifyVotePollVoteStateProof`, `verifyVotePollsByEndDateProof`
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
