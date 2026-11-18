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
  threaded wasm module (`wasm32-wasip1-threads`) for browsers / fallback. The
  consumer provides its instance to dpp explicitly via `setShielded(shielded)`;
  both imports are static, so this survives bundler renaming (no global registry).
  The default entry is **eager** (it instantiates on import); use
  `dash-platform-shielded/lazy` + `loadShielded()` when the load must be deferred. The
  wasm path needs `SharedArrayBuffer` and wasm thread workers, i.e. cross-origin
  isolation in browsers.

### Connect-only sites (no proving)

Drop the `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers
entirely. The base module loads synchronously at import and cross-origin popup
references (e.g. wallet-extension connection popups) keep working — this is the
[_dash-platform-extension#219_](https://github.com/dashpay/dash-platform-extension/issues/219)
fix. Proving APIs remain unavailable until `setShielded(shielded)` is called (use
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
npm i pshenmic-dpp dash-platform-shielded
```

```ts
import shielded from 'dash-platform-shielded'
import { setShielded, ShieldedBuilderWASM } from 'pshenmic-dpp'

// The default shielded entry eagerly instantiates the proving module. Provide it
// explicitly; both imports are static, so this survives bundler renaming with no
// global registry involved. On Node it uses the module's native addon (wasm
// fallback); in the browser it loads the threaded wasm (needs the isolation
// headers above).
setShielded(shielded)

const builder = new ShieldedBuilderWASM()
await builder.init()
// ... shielded/proving APIs are now available
```

If the shielded import must happen before isolation is available (a shared entry,
SSR, tests, or a wasm thread worker), use the deferred entry instead:

```ts
import { loadShielded } from 'dash-platform-shielded/lazy'
import { setShielded } from 'pshenmic-dpp'

setShielded(loadShielded())   // loads now, not at import
```

Without cross-origin isolation the eager `dash-platform-shielded` import — and the wasm
`loadShielded()` call on the lazy entry — fails with a `SharedArrayBuffer` error
(the native addon on Node does not need it). Until `setShielded(shielded)` is
called, shielded classes throw
`The shielded (proving) module has not been loaded. Call setShielded(shielded) first.`

> **Breaking change (major version) for proving consumers:** install
> `dash-platform-shielded` and call `setShielded(shielded)` before using any
> shielded/proving API, and serve the isolation headers above (browser wasm path).
> Previously the threaded module shipped inside `pshenmic-dpp` and loaded at
> import time. Connect-only consumers are unaffected: no extra package, no headers.

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
These proving classes are provided by the separate `dash-platform-shielded` package.
Call `setShielded(shielded)` first (the browser wasm path needs isolation; use
`dash-platform-shielded/lazy` to defer the import) — see
[Shielded proving / cross-origin isolation](#shielded-proving--cross-origin-isolation).
- `ShieldedAddressWASM`, `shieldedOvkFromSeed`
- `FullViewingKeyWASM`
- `IncomingViewingKeyWASM`
- `NoteWASM`
- `SpendableNoteWASM`
- `RecoveredNoteWASM`, `recoverNotes`
- `ShieldedMemoWASM`
- `ShieldedOutputWASM`
- `MerklePathWASM`
- `CommitmentTreeWASM`
- `ShieldedProverWASM`
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
