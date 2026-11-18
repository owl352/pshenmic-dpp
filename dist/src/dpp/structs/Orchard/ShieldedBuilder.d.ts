import type { PlatformVersionNAPI } from '../../../../binaries/bindingsTypes.js';
import type { ShieldedBuilderNAPI } from 'dash-platform-shielded/bindingsTypes';
import { IdentifierLike, PlatformAddressLike, PoolingLike, TokenDistributionLike } from '../../types.js';
import { IdentityWASM } from '../Identity.js';
import { IdentityPublicKeyWASM } from '../IdentityPublicKey.js';
import { GroupStateTransitionInfoWASM } from '../GroupStateTransitionInfo.js';
import { TokenShieldedPaymentWASM } from '../Batch/TokenShieldedPayment.js';
import { OrchardAddressWASM } from './OrchardAddress.js';
import { ShieldedMemoWASM } from './ShieldedMemo.js';
import { SpendableNoteWASM } from './SpendableNote.js';
import { ShieldedWithdrawalResultWASM } from './ShieldedWithdrawalResult.js';
import { ShieldedOutputWASM } from './ShieldedOutput.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { PrivateKeyWASM } from '../PrivateKey.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { StateTransitionWASM } from '../StateTransition.js';
import { InputAddressWASM } from '../AddressTransitions/entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from '../AddressTransitions/entities/AddressFundsFeeStrategyStep.js';
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { IdentityCreateFromShieldedPoolResultWASM } from './IdentityCreateFromShieldedPoolResult.js';
/**
 * Builds and proves shielded (Orchard) state transitions. Construction builds
 * the Halo 2 proving key (~seconds), so create one instance and reuse it.
 *
 * The proving classes live in the separate dash-platform-shielded module: call
 * `setShielded(shielded)` once before `init()` (the default orchard entry is
 * eager; the browser wasm path needs cross-origin isolation, Node uses the
 * native addon).
 *
 * Deposits (`shield`, `shieldFromAssetLock`) don't need pool notes. Spends
 * (`shieldedWithdrawal`, `unshield`, `shieldedTransfer`) need a `SpendableNote`
 * witnessed against an on-chain anchor — rebuild the tree from the full pool
 * note set (getShieldedEncryptedNotes) with `CommitmentTreeWASM`.
 */
export declare class ShieldedBuilderWASM {
    /** @private **/
    _rawShieldedBuilder: ShieldedBuilderNAPI;
    /**
     * Building the Halo 2 proving key takes ~10s, and the key is deterministic,
     * so it's built once per process: every builder instance shares the same
     * raw builder. Cleared on failure so a failed init can be retried.
     */
    private static _initPromise;
    constructor();
    init(): Promise<void>;
    /** Asset lock -> pool (deposit). */
    shieldFromAssetLock(recipient: OrchardAddressWASM, shieldAmount: bigint, assetLockProof: AssetLockProofWASM, privateKey: PrivateKeyWASM, memo: ShieldedMemoWASM, dummyOutputs: number, senderOvk?: Uint8Array, surplusOutput?: PlatformAddressLike, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Transparent platform addresses -> pool (deposit). One private key per input. */
    shield(recipient: OrchardAddressWASM, shieldAmount: bigint, inputs: InputAddressWASM[], privateKeys: PrivateKeyWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], userFeeIncrease: number, memo: ShieldedMemoWASM, senderOvk?: Uint8Array, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Pool -> core L1 (spend). */
    shieldedWithdrawal(spends: SpendableNoteWASM[], withdrawalAmount: bigint, outputScript: CoreScriptWASM, coreFeePerByte: number, pooling: PoolingLike, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /** Pool -> platform identity balance (spend). */
    unshield(spends: SpendableNoteWASM[], outputAddress: PlatformAddressLike, unshieldAmount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /** Pool -> pool (spend). */
    shieldedTransfer(spends: SpendableNoteWASM[], recipient: OrchardAddressWASM, transferAmount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /**
     * Pool -> pool, paying several Orchard addresses in one proof.
     *
     * The spend side matches `shieldedTransfer` — every note must belong to the
     * `seed`/`coinType`/`account` this call derives its spend authority from, and
     * all must be witnessed against the same `anchor`. The output side is a list,
     * each entry carrying its own amount and memo, and the leftover always goes
     * to `changeAddress` (a zero-value change note is still written, which keeps
     * the fee predictable before the change amount is known).
     *
     * Consensus prices the fee off the bundle's action count, which Orchard sets
     * to `max(spends, outputs + 1, 2)` and caps at 16 — so a fan-out of 15
     * recipients is the ceiling, and each extra action adds proving time. Passing
     * more throws before proving rather than after.
     */
    shieldedTransferMulti(spends: SpendableNoteWASM[], outputs: ShieldedOutputWASM[], changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /** Pool -> new identity (spend). One private key per public key, same order. */
    identityCreateFromShieldedPool(publicKeys: IdentityPublicKeyInCreationWASM[], privateKeys: PrivateKeyWASM[], denomination: bigint, sendToAddressOnCreationFailure: PlatformAddressLike, spends: SpendableNoteWASM[], changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<IdentityCreateFromShieldedPoolResultWASM>;
    /** Identity balance -> shielded pool, signed with a transfer key of the identity **/
    shieldFromIdentity(identity: IdentityWASM, recipient: OrchardAddressWASM, shieldAmount: bigint, nonce: bigint, signingKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, userFeeIncrease: number, memo: ShieldedMemoWASM, senderOvk?: Uint8Array, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Shielded pool -> identity balance (a spend); resolves with the transition and its fee **/
    identityTopUpFromShieldedPool(spends: SpendableNoteWASM[], identityId: IdentifierLike, topUpAmount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /**
     * The shielded payment of a document's token cost, spent from the token's shielded pool.
     * Set it as `TokenPaymentInfo.shieldedPayment` of the document transition
     **/
    documentTokenPayment(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, documentId: IdentifierLike, spends: SpendableNoteWASM[], amount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<TokenShieldedPaymentWASM>;
    /** Owner token balance -> token shielded pool, signed with `identityPublicKey` **/
    tokenShield(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, recipient: OrchardAddressWASM, amount: bigint, memo: ShieldedMemoWASM, senderOvk: Uint8Array | undefined, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Token shielded pool -> `recipientId`'s token balance, signed with `identityPublicKey` **/
    tokenUnshield(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, spends: SpendableNoteWASM[], recipientId: IdentifierLike, amount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Token shielded pool -> token shielded pool, signed with `identityPublicKey` **/
    tokenShieldedTransfer(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, spends: SpendableNoteWASM[], recipient: OrchardAddressWASM, transferAmount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** New tokens minted into the token shielded pool; pass `usingGroupInfo` for a group action **/
    tokenMintToPool(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, recipient: OrchardAddressWASM, amount: bigint, memo: ShieldedMemoWASM, senderOvk: Uint8Array | undefined, publicNote: string | undefined, usingGroupInfo: GroupStateTransitionInfoWASM | undefined, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Tokens burned out of the token shielded pool; pass `usingGroupInfo` for a group action **/
    tokenBurnFromPool(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, spends: SpendableNoteWASM[], amount: bigint, changeAddress: OrchardAddressWASM, seed: Uint8Array, coinType: number, account: number, anchor: Uint8Array, memo: ShieldedMemoWASM, publicNote: string | undefined, usingGroupInfo: GroupStateTransitionInfoWASM | undefined, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** A token distribution claimed into the token shielded pool; a perpetual claim must pass `claimUpTo` **/
    tokenClaimToPool(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, recipient: OrchardAddressWASM, amount: bigint, distributionType: TokenDistributionLike, claimUpTo: bigint | undefined, memo: ShieldedMemoWASM, senderOvk: Uint8Array | undefined, publicNote: string | undefined, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /** Tokens bought at their direct purchase price into the token shielded pool **/
    tokenDirectPurchaseToPool(tokenId: IdentifierLike, ownerId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, recipient: OrchardAddressWASM, tokenCount: bigint, totalAgreedPrice: bigint, memo: ShieldedMemoWASM, senderOvk: Uint8Array | undefined, identityPublicKey: IdentityPublicKeyWASM, privateKey: PrivateKeyWASM, identityContractNonce: bigint, userFeeIncrease: number, platformVersion?: PlatformVersionNAPI): Promise<StateTransitionWASM>;
    /**
     * Tokens move inside the token shielded pool, the fee is paid from the credit shielded
     * pool (no identity signs). Token and fee notes are spent with the same seed account, each
     * against its own pool's anchor. Resolves with the transition and its fee
     **/
    tokenShieldedTransferWithShieldedFee(tokenId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, tokenSpends: SpendableNoteWASM[], tokenChangeAddress: OrchardAddressWASM, tokenAnchor: Uint8Array, recipient: OrchardAddressWASM, transferAmount: bigint, feeSpends: SpendableNoteWASM[], feeChangeAddress: OrchardAddressWASM, feeAnchor: Uint8Array, seed: Uint8Array, coinType: number, account: number, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /**
     * Tokens leave the token shielded pool for `recipientId`'s balance, the fee is paid from the
     * credit shielded pool. Resolves with the transition and its fee
     **/
    tokenUnshieldWithShieldedFee(tokenId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, tokenSpends: SpendableNoteWASM[], tokenChangeAddress: OrchardAddressWASM, tokenAnchor: Uint8Array, recipientId: IdentifierLike, amount: bigint, feeSpends: SpendableNoteWASM[], feeChangeAddress: OrchardAddressWASM, feeAnchor: Uint8Array, seed: Uint8Array, coinType: number, account: number, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
    /**
     * Tokens bought at their direct purchase price into the token shielded pool, price and fee
     * paid from the credit shielded pool. `recipient` must belong to the seed account.
     * Resolves with the transition and its fee
     **/
    tokenPurchaseFromShieldedPool(tokenId: IdentifierLike, dataContractId: IdentifierLike, tokenContractPosition: number, recipient: OrchardAddressWASM, tokenCount: bigint, totalAgreedPrice: bigint, feeSpends: SpendableNoteWASM[], feeChangeAddress: OrchardAddressWASM, feeAnchor: Uint8Array, seed: Uint8Array, coinType: number, account: number, memo: ShieldedMemoWASM, platformVersion?: PlatformVersionNAPI): Promise<ShieldedWithdrawalResultWASM>;
}
