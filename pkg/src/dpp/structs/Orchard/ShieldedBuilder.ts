import type { PlatformVersionNAPI, ShieldedBuilderNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { PlatformAddressLike, PoolingLike } from '../../types.js'
import { preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js'
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
}
