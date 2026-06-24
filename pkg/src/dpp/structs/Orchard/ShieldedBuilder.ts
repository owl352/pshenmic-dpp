import type { PlatformVersionNAPI, ShieldedBuilderNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { PlatformAddressLike, PoolingLike } from '../../types.js'
import { preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js'
import { OrchardAddressWASM } from './OrchardAddress.js'
import { ShieldedMemoWASM } from './ShieldedMemo.js'
import { SpendableNoteWASM } from './SpendableNote.js'
import { ShieldedWithdrawalResultWASM } from './ShieldedWithdrawalResult.js'
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

  constructor () {
    this._rawShieldedBuilder = new dppProvider.dpp.ShieldedBuilderNAPI()
  }

  /** Asset lock -> pool (deposit). */
  shieldFromAssetLock (
    recipient: OrchardAddressWASM,
    shieldAmount: bigint,
    assetLockProof: AssetLockProofWASM,
    privateKey: PrivateKeyWASM,
    memo: ShieldedMemoWASM,
    dummyOutputs: number,
    senderOvk?: Uint8Array,
    surplusOutput?: PlatformAddressLike,
    platformVersion?: PlatformVersionNAPI
  ): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedBuilder.shieldFromAssetLock(
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
  shield (
    recipient: OrchardAddressWASM,
    shieldAmount: bigint,
    inputs: InputAddressWASM[],
    privateKeys: PrivateKeyWASM[],
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    memo: ShieldedMemoWASM,
    senderOvk?: Uint8Array,
    platformVersion?: PlatformVersionNAPI
  ): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedBuilder.shield(
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
  shieldedWithdrawal (
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
  ): ShieldedWithdrawalResultWASM {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      this._rawShieldedBuilder.shieldedWithdrawal(
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
  unshield (
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
  ): ShieldedWithdrawalResultWASM {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      this._rawShieldedBuilder.unshield(
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
  shieldedTransfer (
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
  ): ShieldedWithdrawalResultWASM {
    return ShieldedWithdrawalResultWASM.createFromRawInstance(
      this._rawShieldedBuilder.shieldedTransfer(
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

  /** Pool -> new identity (spend). One private key per public key, same order. */
  identityCreateFromShieldedPool (
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
  ): IdentityCreateFromShieldedPoolResultWASM {
    return IdentityCreateFromShieldedPoolResultWASM.createFromRawInstance(
      this._rawShieldedBuilder.identityCreateFromShieldedPool(
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