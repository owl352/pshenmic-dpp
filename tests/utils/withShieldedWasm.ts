// Test-only convenience: dpp's wasm entry + the optional shielded package.
import * as base from 'pshenmic-dpp/wasm'
import * as shielded from 'dash-platform-shielded'
import { createShieldedCompat } from './shieldedCompat.js'

export * from 'pshenmic-dpp/wasm'

// The standalone package's Orchard data classes and verifiers are used as-is.
// Its builder/output/result/recoverNotes entry points are adapted below to the
// memo/transition wrapper surface these suites assert on.
export {
  DashPlatformShielded,
  OrchardAddressWASM,
  FullViewingKeyWASM,
  IncomingViewingKeyWASM,
  NoteWASM,
  MerklePathWASM,
  SpendableNoteWASM,
  CommitmentTreeWASM,
  OrchardProverWASM,
  RecoveredNoteWASM,
  orchardOvkFromSeed,
  loadShielded,
  verifyShieldedEncryptedNotesProof,
  verifyShieldedAnchorsProof,
  verifyMostRecentShieldedAnchorProof,
  verifyShieldedPoolStateProof,
  verifyShieldedNotesCountProof,
  verifyShieldedNullifiersProof
} from 'dash-platform-shielded'

const compat = createShieldedCompat(base, shielded)

export const {
  ShieldedMemoWASM,
  ShieldedOutputWASM,
  ShieldedBuilderWASM,
  ShieldedWithdrawalResultWASM,
  IdentityCreateFromShieldedPoolResultWASM,
  recoverNotes,
  ShieldTransitionWASM,
  ShieldedTransferTransitionWASM,
  ShieldedWithdrawalTransitionWASM,
  UnshieldTransitionWASM,
  ShieldFromAssetLockTransitionWASM,
  ShieldFromIdentityTransitionWASM,
  IdentityCreateFromShieldedPoolTransitionWASM,
  IdentityTopUpFromShieldedPoolTransitionWASM,
  TokenPurchaseFromShieldedPoolTransitionWASM,
  TokenShieldedTransferWithShieldedFeeTransitionWASM,
  TokenUnshieldWithShieldedFeeTransitionWASM
} = compat
