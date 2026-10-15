import type { PlatformVersionNAPI, ShieldedBuilderNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformAddressLike, PoolingLike, TokenDistributionLike } from '../../types.js'
import { prepareIdentifierValue, preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js'
import { IdentityWASM } from '../Identity.js'
import { IdentityPublicKeyWASM } from '../IdentityPublicKey.js'
import { GroupStateTransitionInfoWASM } from '../GroupStateTransitionInfo.js'
import { TokenShieldedPaymentWASM } from '../Batch/TokenShieldedPayment.js'
import { OrchardAddressWASM } from './OrchardAddress.js'
import { ShieldedMemoWASM } from './ShieldedMemo.js'
import { SpendableNoteWASM } from './SpendableNote.js'
import { ShieldedWithdrawalResultWASM } from './ShieldedWithdrawalResult.js'
import { ShieldedOutputWASM } from './ShieldedOutput.js'
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js'
import { PrivateKeyWASM } from '../PrivateKey.js'
import { CoreScriptWASM } from '../CoreScript.js'
import { StateTransitionWASM } from '../StateTransition.js'
import { InputAddressWASM } from '../AddressTransitions/entities/InputAddress.js'
import { AddressFundsFeeStrategyStepWASM } from '../AddressTransitions/entities/AddressFundsFeeStrategyStep.js'
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js'
import { IdentityCreateFromShieldedPoolResultWASM } from './IdentityCreateFromShieldedPoolResult.js'

/**
 * Builds and proves shielded (Orchard) state transitions. Construction builds
 * the Halo 2 proving key (~seconds), so create one instance and reuse it.
 *
 * Deposits (`shield`, `shieldFromAssetLock`) don't need pool notes. Spends
 * (`shieldedWithdrawal`, `unshield`, `shieldedTransfer`) need a `SpendableNote`
 * witnessed against an on-chain anchor — rebuild the tree from the full pool
 * note set (getShieldedEncryptedNotes) with `CommitmentTreeWASM`.
 */
export class ShieldedBuilderWASM {
  /** @private **/
  _rawShieldedBuilder: ShieldedBuilderNAPI

  /**
   * Building the Halo 2 proving key takes ~10s, and the key is deterministic,
   * so it's built once per process: every builder instance shares the same
   * raw builder. Cleared on failure so a failed init can be retried.
   */
  private static _initPromise: Promise<ShieldedBuilderNAPI> | null = null

  constructor () {
    // empty
  }

  async init(): Promise<void> {
    if (ShieldedBuilderWASM._initPromise == null) {
      ShieldedBuilderWASM._initPromise = dppProvider.dpp.ShieldedBuilderNAPI.init()
        .catch((e: Error) => {
          ShieldedBuilderWASM._initPromise = null
          throw e
        })
    }
    this._rawShieldedBuilder = await ShieldedBuilderWASM._initPromise
  }

  /** Asset lock -> pool (deposit). */
  async shieldFromAssetLock (
    recipient: OrchardAddressWASM,
    shieldAmount: bigint,
    assetLockProof: AssetLockProofWASM,
    privateKey: PrivateKeyWASM,
    memo: ShieldedMemoWASM,
    dummyOutputs: number,
    senderOvk?: Uint8Array,
    surplusOutput?: PlatformAddressLike,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shieldFromAssetLock(
        recipient._rawOrchardAddress,
        shieldAmount.toString(),
        assetLockProof._rawAssetLockProof,
        privateKey._rawPrivateKey,
        memo._rawShieldedMemo,
        dummyOutputs,
        senderOvk,
        surplusOutput != null ? preparePlatformAddressValue(surplusOutput) : undefined,
        platformVersion
      )
    )
  }

  /** Transparent platform addresses -> pool (deposit). One private key per input. */
  async shield (
    recipient: OrchardAddressWASM,
    shieldAmount: bigint,
    inputs: InputAddressWASM[],
    privateKeys: PrivateKeyWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    memo: ShieldedMemoWASM,
    senderOvk?: Uint8Array,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shield(
        recipient._rawOrchardAddress,
        shieldAmount.toString(),
        inputs.map(i => i._rawInputAddress),
        privateKeys.map(k => k._rawPrivateKey),
        feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep),
        userFeeIncrease,
        memo._rawShieldedMemo,
        senderOvk,
        platformVersion
      )
    )
  }

  /** Pool -> core L1 (spend). */
  async shieldedWithdrawal (
    spends: SpendableNoteWASM[],
    withdrawalAmount: bigint,
    outputScript: CoreScriptWASM,
    coreFeePerByte: number,
    pooling: PoolingLike,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shieldedWithdrawal(
        spends.map(s => s._rawSpendableNote),
        withdrawalAmount.toString(),
        outputScript._rawCoreScript,
        coreFeePerByte,
        valueToDynamicValue(pooling),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /** Pool -> platform identity balance (spend). */
  async unshield (
    spends: SpendableNoteWASM[],
    outputAddress: PlatformAddressLike,
    unshieldAmount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.unshield(
        spends.map(s => s._rawSpendableNote),
        preparePlatformAddressValue(outputAddress),
        unshieldAmount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /** Pool -> pool (spend). */
  async shieldedTransfer (
    spends: SpendableNoteWASM[],
    recipient: OrchardAddressWASM,
    transferAmount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shieldedTransfer(
        spends.map(s => s._rawSpendableNote),
        recipient._rawOrchardAddress,
        transferAmount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
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
  async shieldedTransferMulti (
    spends: SpendableNoteWASM[],
    outputs: ShieldedOutputWASM[],
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shieldedTransferMulti(
        spends.map(s => s._rawSpendableNote),
        outputs.map(o => o._rawShieldedOutput),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        platformVersion
      )
    )
  }

  /** Pool -> new identity (spend). One private key per public key, same order. */
  async identityCreateFromShieldedPool (
    publicKeys: IdentityPublicKeyInCreationWASM[],
    privateKeys: PrivateKeyWASM[],
    denomination: bigint,
    sendToAddressOnCreationFailure: PlatformAddressLike,
    spends: SpendableNoteWASM[],
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<IdentityCreateFromShieldedPoolResultWASM> {
    return IdentityCreateFromShieldedPoolResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.identityCreateFromShieldedPool(
        publicKeys.map(k => k._rawKeyInCreation),
        privateKeys.map(k => k._rawPrivateKey),
        denomination.toString(),
        preparePlatformAddressValue(sendToAddressOnCreationFailure),
        spends.map(s => s._rawSpendableNote),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /** Identity balance -> shielded pool, signed with a transfer key of the identity **/
  async shieldFromIdentity (
    identity: IdentityWASM,
    recipient: OrchardAddressWASM,
    shieldAmount: bigint,
    nonce: bigint,
    signingKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    userFeeIncrease: number,
    memo: ShieldedMemoWASM,
    senderOvk?: Uint8Array,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.shieldFromIdentity(
        identity._rawIdentity,
        recipient._rawOrchardAddress,
        shieldAmount.toString(),
        nonce.toString(),
        signingKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        userFeeIncrease,
        memo._rawShieldedMemo,
        senderOvk,
        platformVersion
      )
    )
  }

  /** Shielded pool -> identity balance (a spend); resolves with the transition and its fee **/
  async identityTopUpFromShieldedPool (
    spends: SpendableNoteWASM[],
    identityId: IdentifierLike,
    topUpAmount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.identityTopUpFromShieldedPool(
        spends.map(s => s._rawSpendableNote),
        prepareIdentifierValue(identityId),
        topUpAmount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /**
   * The shielded payment of a document's token cost, spent from the token's shielded pool.
   * Set it as `TokenPaymentInfo.shieldedPayment` of the document transition
   **/
  async documentTokenPayment (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    documentId: IdentifierLike,
    spends: SpendableNoteWASM[],
    amount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<TokenShieldedPaymentWASM> {
    return TokenShieldedPaymentWASM.createFromRawInstance(
      await this._rawShieldedBuilder.documentTokenPayment(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        prepareIdentifierValue(documentId),
        spends.map(s => s._rawSpendableNote),
        amount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /** Owner token balance -> token shielded pool, signed with `identityPublicKey` **/
  async tokenShield (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    recipient: OrchardAddressWASM,
    amount: bigint,
    memo: ShieldedMemoWASM,
    senderOvk: Uint8Array | undefined,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenShield(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        recipient._rawOrchardAddress,
        amount.toString(),
        memo._rawShieldedMemo,
        senderOvk,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** Token shielded pool -> `recipientId`'s token balance, signed with `identityPublicKey` **/
  async tokenUnshield (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    spends: SpendableNoteWASM[],
    recipientId: IdentifierLike,
    amount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenUnshield(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        spends.map(s => s._rawSpendableNote),
        prepareIdentifierValue(recipientId),
        amount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** Token shielded pool -> token shielded pool, signed with `identityPublicKey` **/
  async tokenShieldedTransfer (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    spends: SpendableNoteWASM[],
    recipient: OrchardAddressWASM,
    transferAmount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenShieldedTransfer(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        spends.map(s => s._rawSpendableNote),
        recipient._rawOrchardAddress,
        transferAmount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** New tokens minted into the token shielded pool; pass `usingGroupInfo` for a group action **/
  async tokenMintToPool (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    recipient: OrchardAddressWASM,
    amount: bigint,
    memo: ShieldedMemoWASM,
    senderOvk: Uint8Array | undefined,
    publicNote: string | undefined,
    usingGroupInfo: GroupStateTransitionInfoWASM | undefined,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenMintToPool(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        recipient._rawOrchardAddress,
        amount.toString(),
        memo._rawShieldedMemo,
        senderOvk,
        publicNote,
        usingGroupInfo?._rawGroupStateTransitionInfo,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** Tokens burned out of the token shielded pool; pass `usingGroupInfo` for a group action **/
  async tokenBurnFromPool (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    spends: SpendableNoteWASM[],
    amount: bigint,
    changeAddress: OrchardAddressWASM,
    seed: Uint8Array,
    coinType: number,
    account: number,
    anchor: Uint8Array,
    memo: ShieldedMemoWASM,
    publicNote: string | undefined,
    usingGroupInfo: GroupStateTransitionInfoWASM | undefined,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenBurnFromPool(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        spends.map(s => s._rawSpendableNote),
        amount.toString(),
        changeAddress._rawOrchardAddress,
        seed,
        coinType,
        account,
        anchor,
        memo._rawShieldedMemo,
        publicNote,
        usingGroupInfo?._rawGroupStateTransitionInfo,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** A token distribution claimed into the token shielded pool; a perpetual claim must pass `claimUpTo` **/
  async tokenClaimToPool (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    recipient: OrchardAddressWASM,
    amount: bigint,
    distributionType: TokenDistributionLike,
    claimUpTo: bigint | undefined,
    memo: ShieldedMemoWASM,
    senderOvk: Uint8Array | undefined,
    publicNote: string | undefined,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenClaimToPool(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        recipient._rawOrchardAddress,
        amount.toString(),
        valueToDynamicValue(distributionType),
        claimUpTo?.toString(),
        memo._rawShieldedMemo,
        senderOvk,
        publicNote,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /** Tokens bought at their direct purchase price into the token shielded pool **/
  async tokenDirectPurchaseToPool (
    tokenId: IdentifierLike,
    ownerId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    recipient: OrchardAddressWASM,
    tokenCount: bigint,
    totalAgreedPrice: bigint,
    memo: ShieldedMemoWASM,
    senderOvk: Uint8Array | undefined,
    identityPublicKey: IdentityPublicKeyWASM,
    privateKey: PrivateKeyWASM,
    identityContractNonce: bigint,
    userFeeIncrease: number,
    platformVersion?: PlatformVersionNAPI
  ): Promise<StateTransitionWASM> {
    return StateTransitionWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenDirectPurchaseToPool(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(ownerId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        recipient._rawOrchardAddress,
        tokenCount.toString(),
        totalAgreedPrice.toString(),
        memo._rawShieldedMemo,
        senderOvk,
        identityPublicKey._rawIdentityPublicKey,
        privateKey._rawPrivateKey,
        identityContractNonce.toString(),
        userFeeIncrease,
        platformVersion
      )
    )
  }

  /**
   * Tokens move inside the token shielded pool, the fee is paid from the credit shielded
   * pool (no identity signs). Token and fee notes are spent with the same seed account, each
   * against its own pool's anchor. Resolves with the transition and its fee
   **/
  async tokenShieldedTransferWithShieldedFee (
    tokenId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenSpends: SpendableNoteWASM[],
    tokenChangeAddress: OrchardAddressWASM,
    tokenAnchor: Uint8Array,
    recipient: OrchardAddressWASM,
    transferAmount: bigint,
    feeSpends: SpendableNoteWASM[],
    feeChangeAddress: OrchardAddressWASM,
    feeAnchor: Uint8Array,
    seed: Uint8Array,
    coinType: number,
    account: number,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenShieldedTransferWithShieldedFee(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        tokenSpends.map(s => s._rawSpendableNote),
        tokenChangeAddress._rawOrchardAddress,
        tokenAnchor,
        recipient._rawOrchardAddress,
        transferAmount.toString(),
        feeSpends.map(s => s._rawSpendableNote),
        feeChangeAddress._rawOrchardAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /**
   * Tokens leave the token shielded pool for `recipientId`'s balance, the fee is paid from the
   * credit shielded pool. Resolves with the transition and its fee
   **/
  async tokenUnshieldWithShieldedFee (
    tokenId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenSpends: SpendableNoteWASM[],
    tokenChangeAddress: OrchardAddressWASM,
    tokenAnchor: Uint8Array,
    recipientId: IdentifierLike,
    amount: bigint,
    feeSpends: SpendableNoteWASM[],
    feeChangeAddress: OrchardAddressWASM,
    feeAnchor: Uint8Array,
    seed: Uint8Array,
    coinType: number,
    account: number,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenUnshieldWithShieldedFee(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        tokenSpends.map(s => s._rawSpendableNote),
        tokenChangeAddress._rawOrchardAddress,
        tokenAnchor,
        prepareIdentifierValue(recipientId),
        amount.toString(),
        feeSpends.map(s => s._rawSpendableNote),
        feeChangeAddress._rawOrchardAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }

  /**
   * Tokens bought at their direct purchase price into the token shielded pool, price and fee
   * paid from the credit shielded pool. `recipient` must belong to the seed account.
   * Resolves with the transition and its fee
   **/
  async tokenPurchaseFromShieldedPool (
    tokenId: IdentifierLike,
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    recipient: OrchardAddressWASM,
    tokenCount: bigint,
    totalAgreedPrice: bigint,
    feeSpends: SpendableNoteWASM[],
    feeChangeAddress: OrchardAddressWASM,
    feeAnchor: Uint8Array,
    seed: Uint8Array,
    coinType: number,
    account: number,
    memo: ShieldedMemoWASM,
    platformVersion?: PlatformVersionNAPI
  ): Promise<ShieldedWithdrawalResultWASM> {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      await this._rawShieldedBuilder.tokenPurchaseFromShieldedPool(
        prepareIdentifierValue(tokenId),
        prepareIdentifierValue(dataContractId),
        tokenContractPosition,
        recipient._rawOrchardAddress,
        tokenCount.toString(),
        totalAgreedPrice.toString(),
        feeSpends.map(s => s._rawSpendableNote),
        feeChangeAddress._rawOrchardAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo._rawShieldedMemo,
        platformVersion
      )
    )
  }
}
