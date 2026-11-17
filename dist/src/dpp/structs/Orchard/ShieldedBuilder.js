import { dppProvider } from '../../provider.js';
import { IdentifierWASM } from '../Identifier.js';
import { TokenShieldedPaymentWASM } from '../Batch/TokenShieldedPayment.js';
import { ShieldedWithdrawalResultWASM } from './ShieldedWithdrawalResult.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { StateTransitionWASM } from '../StateTransition.js';
import { IdentityCreateFromShieldedPoolResultWASM } from './IdentityCreateFromShieldedPoolResult.js';
/**
 * Builds and proves shielded (Orchard) state transitions. Construction builds
 * the Halo 2 proving key (~seconds), so create one instance and reuse it.
 *
 * The proving classes live in the separate pshenmic-orchard module: call
 * `setShielded(loadShielded())` once before `init()` (the browser wasm path needs
 * cross-origin isolation; Node uses the native addon).
 *
 * Deposits (`shield`, `shieldFromAssetLock`) don't need pool notes. Spends
 * (`shieldedWithdrawal`, `unshield`, `shieldedTransfer`) need a `SpendableNote`
 * witnessed against an on-chain anchor — rebuild the tree from the full pool
 * note set (getShieldedEncryptedNotes) with `CommitmentTreeWASM`.
 */
export class ShieldedBuilderWASM {
    /** @private **/
    _rawShieldedBuilder;
    /**
     * Building the Halo 2 proving key takes ~10s, and the key is deterministic,
     * so it's built once per process: every builder instance shares the same
     * raw builder. Cleared on failure so a failed init can be retried.
     */
    static _initPromise = null;
    constructor() {
        // empty
    }
    async init() {
        if (ShieldedBuilderWASM._initPromise == null) {
            ShieldedBuilderWASM._initPromise = dppProvider.shielded.ShieldedBuilderNAPI.init()
                .catch((e) => {
                ShieldedBuilderWASM._initPromise = null;
                throw e;
            });
        }
        this._rawShieldedBuilder = await ShieldedBuilderWASM._initPromise;
    }
    /** Asset lock -> pool (deposit). */
    async shieldFromAssetLock(recipient, shieldAmount, assetLockProof, privateKey, memo, dummyOutputs, senderOvk, surplusOutput, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.shieldFromAssetLock(recipient._rawOrchardAddress, shieldAmount.toString(), assetLockProof.bytes(), privateKey.bytes(), memo.toBytes(), dummyOutputs, senderOvk, surplusOutput != null ? new PlatformAddressWASM(surplusOutput).bytes() : undefined, platformVersion));
    }
    /** Transparent platform addresses -> pool (deposit). One private key per input. */
    async shield(recipient, shieldAmount, inputs, privateKeys, feeStrategy, userFeeIncrease, memo, senderOvk, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.shield(recipient._rawOrchardAddress, shieldAmount.toString(), inputs.map(i => i.bytes()), privateKeys.map(k => k.bytes()), feeStrategy.map(s => s.bytes()), userFeeIncrease, memo.toBytes(), senderOvk, platformVersion));
    }
    /** Pool -> core L1 (spend). */
    async shieldedWithdrawal(spends, withdrawalAmount, outputScript, coreFeePerByte, pooling, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.shieldedWithdrawal(spends.map(s => s._rawSpendableNote), withdrawalAmount.toString(), outputScript.bytes(), coreFeePerByte, pooling, changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
    /** Pool -> platform identity balance (spend). */
    async unshield(spends, outputAddress, unshieldAmount, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.unshield(spends.map(s => s._rawSpendableNote), new PlatformAddressWASM(outputAddress).bytes(), unshieldAmount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
    /** Pool -> pool (spend). */
    async shieldedTransfer(spends, recipient, transferAmount, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.shieldedTransfer(spends.map(s => s._rawSpendableNote), recipient._rawOrchardAddress, transferAmount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
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
    async shieldedTransferMulti(spends, outputs, changeAddress, seed, coinType, account, anchor, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.shieldedTransferMulti(spends.map(s => s._rawSpendableNote), outputs.map(o => o._rawShieldedOutput), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, platformVersion));
    }
    /** Pool -> new identity (spend). One private key per public key, same order. */
    async identityCreateFromShieldedPool(publicKeys, privateKeys, denomination, sendToAddressOnCreationFailure, spends, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return IdentityCreateFromShieldedPoolResultWASM.createFromRawInstance(await this._rawShieldedBuilder.identityCreateFromShieldedPool(publicKeys.map(k => k.bytes()), privateKeys.map(k => k.bytes()), denomination.toString(), new PlatformAddressWASM(sendToAddressOnCreationFailure).bytes(), spends.map(s => s._rawSpendableNote), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
    /** Identity balance -> shielded pool, signed with a transfer key of the identity **/
    async shieldFromIdentity(identity, recipient, shieldAmount, nonce, signingKey, privateKey, userFeeIncrease, memo, senderOvk, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.shieldFromIdentity(identity.bytes(), recipient._rawOrchardAddress, shieldAmount.toString(), nonce.toString(), signingKey.bytes(), privateKey.bytes(), userFeeIncrease, memo.toBytes(), senderOvk, platformVersion));
    }
    /** Shielded pool -> identity balance (a spend); resolves with the transition and its fee **/
    async identityTopUpFromShieldedPool(spends, identityId, topUpAmount, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.identityTopUpFromShieldedPool(spends.map(s => s._rawSpendableNote), new IdentifierWASM(identityId).bytes(), topUpAmount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
    /**
     * The shielded payment of a document's token cost, spent from the token's shielded pool.
     * Set it as `TokenPaymentInfo.shieldedPayment` of the document transition
     **/
    async documentTokenPayment(tokenId, ownerId, dataContractId, documentId, spends, amount, changeAddress, seed, coinType, account, anchor, memo, platformVersion) {
        return TokenShieldedPaymentWASM.fromBytes(await this._rawShieldedBuilder.documentTokenPayment(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), new IdentifierWASM(documentId).bytes(), spends.map(s => s._rawSpendableNote), amount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), platformVersion));
    }
    /** Owner token balance -> token shielded pool, signed with `identityPublicKey` **/
    async tokenShield(tokenId, ownerId, dataContractId, tokenContractPosition, recipient, amount, memo, senderOvk, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenShield(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, recipient._rawOrchardAddress, amount.toString(), memo.toBytes(), senderOvk, identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** Token shielded pool -> `recipientId`'s token balance, signed with `identityPublicKey` **/
    async tokenUnshield(tokenId, ownerId, dataContractId, tokenContractPosition, spends, recipientId, amount, changeAddress, seed, coinType, account, anchor, memo, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenUnshield(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, spends.map(s => s._rawSpendableNote), new IdentifierWASM(recipientId).bytes(), amount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** Token shielded pool -> token shielded pool, signed with `identityPublicKey` **/
    async tokenShieldedTransfer(tokenId, ownerId, dataContractId, tokenContractPosition, spends, recipient, transferAmount, changeAddress, seed, coinType, account, anchor, memo, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenShieldedTransfer(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, spends.map(s => s._rawSpendableNote), recipient._rawOrchardAddress, transferAmount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** New tokens minted into the token shielded pool; pass `usingGroupInfo` for a group action **/
    async tokenMintToPool(tokenId, ownerId, dataContractId, tokenContractPosition, recipient, amount, memo, senderOvk, publicNote, usingGroupInfo, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenMintToPool(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, recipient._rawOrchardAddress, amount.toString(), memo.toBytes(), senderOvk, publicNote, usingGroupInfo?.bytes(), identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** Tokens burned out of the token shielded pool; pass `usingGroupInfo` for a group action **/
    async tokenBurnFromPool(tokenId, ownerId, dataContractId, tokenContractPosition, spends, amount, changeAddress, seed, coinType, account, anchor, memo, publicNote, usingGroupInfo, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenBurnFromPool(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, spends.map(s => s._rawSpendableNote), amount.toString(), changeAddress._rawOrchardAddress, seed, coinType, account, anchor, memo.toBytes(), publicNote, usingGroupInfo?.bytes(), identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** A token distribution claimed into the token shielded pool; a perpetual claim must pass `claimUpTo` **/
    async tokenClaimToPool(tokenId, ownerId, dataContractId, tokenContractPosition, recipient, amount, distributionType, claimUpTo, memo, senderOvk, publicNote, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenClaimToPool(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, recipient._rawOrchardAddress, amount.toString(), distributionType, claimUpTo?.toString(), memo.toBytes(), senderOvk, publicNote, identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /** Tokens bought at their direct purchase price into the token shielded pool **/
    async tokenDirectPurchaseToPool(tokenId, ownerId, dataContractId, tokenContractPosition, recipient, tokenCount, totalAgreedPrice, memo, senderOvk, identityPublicKey, privateKey, identityContractNonce, userFeeIncrease, platformVersion) {
        return StateTransitionWASM.fromBytes(await this._rawShieldedBuilder.tokenDirectPurchaseToPool(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(ownerId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, recipient._rawOrchardAddress, tokenCount.toString(), totalAgreedPrice.toString(), memo.toBytes(), senderOvk, identityPublicKey.bytes(), privateKey.bytes(), identityContractNonce.toString(), userFeeIncrease, platformVersion));
    }
    /**
     * Tokens move inside the token shielded pool, the fee is paid from the credit shielded
     * pool (no identity signs). Token and fee notes are spent with the same seed account, each
     * against its own pool's anchor. Resolves with the transition and its fee
     **/
    async tokenShieldedTransferWithShieldedFee(tokenId, dataContractId, tokenContractPosition, tokenSpends, tokenChangeAddress, tokenAnchor, recipient, transferAmount, feeSpends, feeChangeAddress, feeAnchor, seed, coinType, account, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.tokenShieldedTransferWithShieldedFee(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, tokenSpends.map(s => s._rawSpendableNote), tokenChangeAddress._rawOrchardAddress, tokenAnchor, recipient._rawOrchardAddress, transferAmount.toString(), feeSpends.map(s => s._rawSpendableNote), feeChangeAddress._rawOrchardAddress, feeAnchor, seed, coinType, account, memo.toBytes(), platformVersion));
    }
    /**
     * Tokens leave the token shielded pool for `recipientId`'s balance, the fee is paid from the
     * credit shielded pool. Resolves with the transition and its fee
     **/
    async tokenUnshieldWithShieldedFee(tokenId, dataContractId, tokenContractPosition, tokenSpends, tokenChangeAddress, tokenAnchor, recipientId, amount, feeSpends, feeChangeAddress, feeAnchor, seed, coinType, account, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.tokenUnshieldWithShieldedFee(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, tokenSpends.map(s => s._rawSpendableNote), tokenChangeAddress._rawOrchardAddress, tokenAnchor, new IdentifierWASM(recipientId).bytes(), amount.toString(), feeSpends.map(s => s._rawSpendableNote), feeChangeAddress._rawOrchardAddress, feeAnchor, seed, coinType, account, memo.toBytes(), platformVersion));
    }
    /**
     * Tokens bought at their direct purchase price into the token shielded pool, price and fee
     * paid from the credit shielded pool. `recipient` must belong to the seed account.
     * Resolves with the transition and its fee
     **/
    async tokenPurchaseFromShieldedPool(tokenId, dataContractId, tokenContractPosition, recipient, tokenCount, totalAgreedPrice, feeSpends, feeChangeAddress, feeAnchor, seed, coinType, account, memo, platformVersion) {
        return ShieldedWithdrawalResultWASM.createFromRawInstance(await this._rawShieldedBuilder.tokenPurchaseFromShieldedPool(new IdentifierWASM(tokenId).bytes(), new IdentifierWASM(dataContractId).bytes(), tokenContractPosition, recipient._rawOrchardAddress, tokenCount.toString(), totalAgreedPrice.toString(), feeSpends.map(s => s._rawSpendableNote), feeChangeAddress._rawOrchardAddress, feeAnchor, seed, coinType, account, memo.toBytes(), platformVersion));
    }
}
