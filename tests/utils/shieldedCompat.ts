// Test-only adapters for the shielded split.
//
// dpp used to export thin JS wrappers for the shield transitions and the
// proving builder. The transition wrappers were removed from dpp and the
// builder moved to the standalone `dash-platform-shielded` package. These
// adapters re-create the old wrapper surface on top of:
//   - the base NAPI transition classes still exposed by dpp (`base.dpp`), and
//   - the standalone shielded package (`shielded.*`).
//
// They keep the cross-package suites readable without re-adding shielded code
// to dpp's public API. Nothing here is shipped: it lives under tests/ only.

/* eslint-disable @typescript-eslint/no-explicit-any */

// Type names from the removed wrapper sources; the suites are transpiled by
// babel, so `any` aliases are enough to keep the code readable.
type PlatformVersionNAPI = any
type IdentifierLike = any
type PlatformAddressLike = any
type PoolingLike = any
type IdentifierLikeNAPI = any
type PlatformAddressLikeNAPI = any
type ShieldedMemoNAPI = any
type ShieldedOutputNAPI = any
type ShieldedBuilderNAPI = any
type ShieldedWithdrawalResultNAPI = any
type IdentityCreateFromShieldedPoolResultNAPI = any
type ShieldTransitionNAPI = any
type ShieldedTransferTransitionNAPI = any
type ShieldedWithdrawalTransitionNAPI = any
type UnshieldTransitionNAPI = any
type ShieldFromAssetLockTransitionNAPI = any
type ShieldFromIdentityTransitionNAPI = any
type IdentityCreateFromShieldedPoolTransitionNAPI = any
type IdentityTopUpFromShieldedPoolTransitionNAPI = any
type TokenPurchaseFromShieldedPoolTransitionNAPI = any
type TokenShieldedTransferWithShieldedFeeTransitionNAPI = any
type TokenUnshieldWithShieldedFeeTransitionNAPI = any

const UINT32MAX = 4294967295

export function createShieldedCompat (base: any, shielded: any): Record<string, any> {
  const proto = (): any => base.dpp

  // ---------------------------------------------------------------------------
  // dpp base wrappers (same class objects on every entry: native.js and
  // wasm.js both re-export the shared struct modules).
  // ---------------------------------------------------------------------------
  const StateTransitionWASM = base.StateTransitionWASM
  const SerializedActionWASM = base.SerializedActionWASM
  const IdentifierWASM = base.IdentifierWASM
  const IdentityWASM = base.IdentityWASM
  const IdentityPublicKeyWASM = base.IdentityPublicKeyWASM
  const IdentityPublicKeyInCreationWASM = base.IdentityPublicKeyInCreationWASM
  const PlatformAddressWASM = base.PlatformAddressWASM
  const PrivateKeyWASM = base.PrivateKeyWASM
  const CoreScriptWASM = base.CoreScriptWASM
  const AssetLockProofWASM = base.AssetLockProofWASM
  const InputAddressWASM = base.InputAddressWASM
  const AddressFundsFeeStrategyStepWASM = base.AddressFundsFeeStrategyStepWASM
  const AddressWitnessWASM = base.AddressWitnessWASM
  const GroupStateTransitionInfoWASM = base.GroupStateTransitionInfoWASM
  const TokenShieldedPaymentWASM = base.TokenShieldedPaymentWASM

  // ---------------------------------------------------------------------------
  // shielded package wrappers (Orchard data classes + proving).
  // ---------------------------------------------------------------------------
  const OrchardAddressWASM = shielded.OrchardAddressWASM
  const NoteWASM = shielded.NoteWASM
  const MerklePathWASM = shielded.MerklePathWASM
  const SpendableNoteWASM = shielded.SpendableNoteWASM
  const CommitmentTreeWASM = shielded.CommitmentTreeWASM
  const FullViewingKeyWASM = shielded.FullViewingKeyWASM
  const IncomingViewingKeyWASM = shielded.IncomingViewingKeyWASM
  const OrchardProverWASM = shielded.OrchardProverWASM
  const RecoveredNoteWASM = shielded.RecoveredNoteWASM
  const orchardOvkFromSeed = shielded.orchardOvkFromSeed

  // ---------------------------------------------------------------------------
  // Entry-specific conversions (never use the dppProvider singleton here: a
  // suite may run against the wasm entry while this module was imported first).
  // ---------------------------------------------------------------------------
  function stateTransitionFromBytes (bytes: Uint8Array): any {
    return StateTransitionWASM.createFromRawInstance(proto().StateTransitionNAPI.fromBytes(bytes))
  }

  function tokenPaymentFromBytes (bytes: Uint8Array): any {
    return TokenShieldedPaymentWASM.createFromRawInstance(
      proto().TokenShieldedPaymentNAPI.fromBytes(bytes)
    )
  }

  function identifierFromBytes (bytes: Uint8Array): any {
    return IdentifierWASM.createFromRawInstance(proto().IdentifierNAPI.fromBytes(bytes))
  }

  function keyInCreationFromBytes (bytes: Uint8Array): any {
    return IdentityPublicKeyInCreationWASM.createFromRawInstance(
      proto().IdentityPublicKeyInCreationNAPI.fromBytes(bytes)
    )
  }

  function serializedActionFromBytes (bytes: Uint8Array): any {
    return SerializedActionWASM.createFromRawInstance(
      proto().SerializedActionNAPI.fromBytes(bytes)
    )
  }

  function prepareIdentifierValue (identifier: IdentifierLike): IdentifierLikeNAPI {
    if (identifier instanceof IdentifierWASM) {
      return identifier._rawIdentifier
    } else if (identifier instanceof proto().IdentifierNAPI) {
      return identifier
    } else {
      return new (proto().DynamicValue)(identifier)
    }
  }

  function preparePlatformAddressValue (address: PlatformAddressLike): PlatformAddressLikeNAPI {
    if (address instanceof PlatformAddressWASM) {
      return address._rawPlatformAddress
    } else if (address instanceof proto().PlatformAddressNAPI) {
      return address
    } else {
      return new (proto().DynamicValue)(address)
    }
  }

  function wrapDynamicValue (value: any, Ctor: any, IdentifierNAPI?: any): any {
    if (typeof value === 'bigint' || (value > UINT32MAX && typeof value !== 'string')) {
      return Ctor.fromBigIntString(BigInt(value.toString()).toString())
    } else if (value instanceof IdentifierWASM || (IdentifierNAPI != null && value instanceof IdentifierNAPI)) {
      return new Ctor(value.bytes())
    } else if (value instanceof Uint8Array) {
      return new Ctor(value)
    } else if (Array.isArray(value)) {
      return new Ctor(value.map((v: any) => wrapDynamicValue(v, Ctor, IdentifierNAPI)))
    } else if (typeof value === 'object' && value !== null) {
      const objectWithDynamicValue: Record<string, any> = Object.assign({}, value)

      for (const key of Object.keys(value)) {
        objectWithDynamicValue[key] = wrapDynamicValue(value[key], Ctor, IdentifierNAPI)
      }

      return new Ctor(objectWithDynamicValue)
    } else if (typeof value === 'function') {
      throw new Error('Cannot parse value from function')
    } if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value > 4294967295 || value < 0) {
          return Ctor.fromInt(value)
        } else {
          return Ctor.fromUInt(value)
        }
      } else {
        return Ctor.fromFloat(value)
      }
    } else {
      return new Ctor(value)
    }
  }

  function valueToDynamicValue (value: any): any {
    return wrapDynamicValue(value, proto().DynamicValue, proto().IdentifierNAPI)
  }

  // ---------------------------------------------------------------------------
  // Removed dpp wrappers, re-created verbatim on the base NAPI classes.
  // ---------------------------------------------------------------------------

class ShieldedMemoWASM {
  /** @private **/
  _rawShieldedMemo: ShieldedMemoNAPI

  toString (): string {
    return this._rawShieldedMemo.toString()
  }

  toBytes (): Uint8Array {
    return this._rawShieldedMemo.toBytes()
  }

  static empty (): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      proto().ShieldedMemoNAPI.empty()
    )
  }

  static fromString (value: string): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      proto().ShieldedMemoNAPI.fromString(value)
    )
  }

  static other (kind: number, payload: Uint8Array): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      proto().ShieldedMemoNAPI.other(kind, payload)
    )
  }

  static fromBytes (bytes: Uint8Array): ShieldedMemoWASM {
    return ShieldedMemoWASM.createFromRawInstance(
      proto().ShieldedMemoNAPI.fromBytes(bytes)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedMemoNAPI): ShieldedMemoWASM {
    const instance: ShieldedMemoWASM = Object.create(ShieldedMemoWASM.prototype)
    instance._rawShieldedMemo = rawInstance

    return instance
  }
}

class ShieldTransitionWASM {
  /** @private **/
  _rawShieldTransition: ShieldTransitionNAPI

  constructor (
    inputs: InputAddressWASM[],
    actions: SerializedActionWASM[],
    amount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    feeStrategy: AddressFundsFeeStrategyStepWASM[],
    userFeeIncrease: number,
    inputWitnesses: AddressWitnessWASM[]
  ) {
    this._rawShieldTransition = new (proto().ShieldTransitionNAPI)(
      inputs.map(i => i._rawInputAddress),
      actions.map(a => a._rawSerializedAction),
      amount.toString(),
      anchor,
      proof,
      bindingsSignature,
      feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep),
      userFeeIncrease,
      inputWitnesses.map(w => w._rawWitness)
    )
  }

  get inputs (): InputAddressWASM[] {
    return this._rawShieldTransition.inputs.map(InputAddressWASM.createFromRawInstance)
  }

  set inputs (value: InputAddressWASM[]) {
    this._rawShieldTransition.inputs = value.map(i => i._rawInputAddress)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get amount (): bigint {
    return BigInt(this._rawShieldTransition.amount)
  }

  set amount (value: bigint) {
    this._rawShieldTransition.amount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldTransition.bindingsSignature = value
  }

  get feeStrategy (): AddressFundsFeeStrategyStepWASM[] {
    return this._rawShieldTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance)
  }

  set feeStrategy (value: AddressFundsFeeStrategyStepWASM[]) {
    this._rawShieldTransition.feeStrategy = value.map(s => s._rawAddressFundsFeeStrategyStep)
  }

  get userFeeIncrease (): number {
    return this._rawShieldTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawShieldTransition.userFeeIncrease = value
  }

  get inputWitnesses (): AddressWitnessWASM[] {
    return this._rawShieldTransition.inputWitnesses.map(AddressWitnessWASM.createFromRawInstance)
  }

  set inputWitnesses (value: AddressWitnessWASM[]) {
    this._rawShieldTransition.inputWitnesses = value.map(w => w._rawWitness)
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().ShieldTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldTransitionWASM {
    return ShieldTransitionWASM.createFromRawInstance(
      proto().ShieldTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldTransitionNAPI): ShieldTransitionWASM {
    const instance: ShieldTransitionWASM = Object.create(ShieldTransitionWASM.prototype)
    instance._rawShieldTransition = rawInstance

    return instance
  }
}

class ShieldedTransferTransitionWASM {
  /** @private **/
  _rawShieldedTransferTransition: ShieldedTransferTransitionNAPI

  constructor (
    actions: SerializedActionWASM[],
    valueBalance: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawShieldedTransferTransition = new (proto().ShieldedTransferTransitionNAPI)(
      actions.map(a => a._rawSerializedAction),
      valueBalance.toString(),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldedTransferTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldedTransferTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get valueBalance (): bigint {
    return BigInt(this._rawShieldedTransferTransition.valueBalance)
  }

  set valueBalance (value: bigint) {
    this._rawShieldedTransferTransition.valueBalance = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldedTransferTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldedTransferTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldedTransferTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldedTransferTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldedTransferTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldedTransferTransition.bindingsSignature = value
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().ShieldedTransferTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedTransferTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldedTransferTransitionWASM {
    return ShieldedTransferTransitionWASM.createFromRawInstance(
      proto().ShieldedTransferTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedTransferTransitionNAPI): ShieldedTransferTransitionWASM {
    const instance: ShieldedTransferTransitionWASM = Object.create(ShieldedTransferTransitionWASM.prototype)
    instance._rawShieldedTransferTransition = rawInstance

    return instance
  }
}

class ShieldedWithdrawalTransitionWASM {
  /** @private **/
  _rawShieldedWithdrawalTransition: ShieldedWithdrawalTransitionNAPI

  constructor (
    actions: SerializedActionWASM[],
    unshieldingAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    coreFeePerByte: number,
    pooling: PoolingLike,
    outputScript: CoreScriptWASM
  ) {
    this._rawShieldedWithdrawalTransition = new (proto().ShieldedWithdrawalTransitionNAPI)(
      actions.map(a => a._rawSerializedAction),
      unshieldingAmount.toString(),
      anchor,
      proof,
      bindingsSignature,
      coreFeePerByte,
      valueToDynamicValue(pooling),
      outputScript._rawCoreScript
    )
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldedWithdrawalTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldedWithdrawalTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get unshieldingAmount (): bigint {
    return BigInt(this._rawShieldedWithdrawalTransition.unshieldingAmount)
  }

  set unshieldingAmount (value: bigint) {
    this._rawShieldedWithdrawalTransition.unshieldingAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldedWithdrawalTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldedWithdrawalTransition.bindingsSignature = value
  }

  get coreFeePerByte (): number {
    return this._rawShieldedWithdrawalTransition.coreFeePerByte
  }

  set coreFeePerByte (value: number) {
    this._rawShieldedWithdrawalTransition.coreFeePerByte = value
  }

  get pooling (): string {
    return this._rawShieldedWithdrawalTransition.pooling
  }

  set pooling (value: PoolingLike) {
    this._rawShieldedWithdrawalTransition.pooling = valueToDynamicValue(value)
  }

  get outputScript (): CoreScriptWASM {
    return CoreScriptWASM.createFromRawInstance(this._rawShieldedWithdrawalTransition.outputScript)
  }

  set outputScript (value: CoreScriptWASM) {
    this._rawShieldedWithdrawalTransition.outputScript = value._rawCoreScript
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().ShieldedWithdrawalTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldedWithdrawalTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldedWithdrawalTransitionWASM {
    return ShieldedWithdrawalTransitionWASM.createFromRawInstance(
      proto().ShieldedWithdrawalTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldedWithdrawalTransitionNAPI): ShieldedWithdrawalTransitionWASM {
    const instance: ShieldedWithdrawalTransitionWASM = Object.create(ShieldedWithdrawalTransitionWASM.prototype)
    instance._rawShieldedWithdrawalTransition = rawInstance

    return instance
  }
}

class UnshieldTransitionWASM {
  /** @private **/
  _rawUnshieldTransition: UnshieldTransitionNAPI

  constructor (
    outputAddress: PlatformAddressLike,
    actions: SerializedActionWASM[],
    unshieldingAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array
  ) {
    this._rawUnshieldTransition = new (proto().UnshieldTransitionNAPI)(
      preparePlatformAddressValue(outputAddress),
      actions.map(a => a._rawSerializedAction),
      unshieldingAmount.toString(),
      anchor,
      proof,
      bindingsSignature
    )
  }

  get outputAddress (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawUnshieldTransition.outputAddress)
  }

  set outputAddress (value: PlatformAddressLike) {
    this._rawUnshieldTransition.outputAddress = preparePlatformAddressValue(value)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawUnshieldTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawUnshieldTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get unshieldingAmount (): bigint {
    return BigInt(this._rawUnshieldTransition.unshieldingAmount)
  }

  set unshieldingAmount (value: bigint) {
    this._rawUnshieldTransition.unshieldingAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawUnshieldTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawUnshieldTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawUnshieldTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawUnshieldTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawUnshieldTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawUnshieldTransition.bindingsSignature = value
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().UnshieldTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawUnshieldTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): UnshieldTransitionWASM {
    return UnshieldTransitionWASM.createFromRawInstance(
      proto().UnshieldTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: UnshieldTransitionNAPI): UnshieldTransitionWASM {
    const instance: UnshieldTransitionWASM = Object.create(UnshieldTransitionWASM.prototype)
    instance._rawUnshieldTransition = rawInstance

    return instance
  }
}

class ShieldFromAssetLockTransitionWASM {
  /** @private **/
  _rawShieldFromAssetLockTransition: ShieldFromAssetLockTransitionNAPI

  constructor (
    assetLockProof: AssetLockProofWASM,
    actions: SerializedActionWASM[],
    valueBalance: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    surplusOutput?: PlatformAddressLike
  ) {
    this._rawShieldFromAssetLockTransition = new (proto().ShieldFromAssetLockTransitionNAPI)(
      assetLockProof._rawAssetLockProof,
      actions.map(a => a._rawSerializedAction),
      valueBalance.toString(),
      anchor,
      proof,
      bindingsSignature,
      surplusOutput != null ? preparePlatformAddressValue(surplusOutput) : undefined
    )
  }

  get assetLockProof (): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(this._rawShieldFromAssetLockTransition.assetLockProof)
  }

  set assetLockProof (value: AssetLockProofWASM) {
    this._rawShieldFromAssetLockTransition.assetLockProof = value._rawAssetLockProof
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldFromAssetLockTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldFromAssetLockTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get valueBalance (): bigint {
    return BigInt(this._rawShieldFromAssetLockTransition.valueBalance)
  }

  set valueBalance (value: bigint) {
    this._rawShieldFromAssetLockTransition.valueBalance = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.bindingsSignature = value
  }

  get surplusOutput (): PlatformAddressWASM | undefined {
    const output = this._rawShieldFromAssetLockTransition.surplusOutput

    if (output != null) {
      return PlatformAddressWASM.createFromRawInstance(output)
    }
  }

  set surplusOutput (value: PlatformAddressLike | undefined) {
    this._rawShieldFromAssetLockTransition.surplusOutput = value != null
      ? preparePlatformAddressValue(value)
      : undefined
  }

  get signature (): Uint8Array {
    return this._rawShieldFromAssetLockTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawShieldFromAssetLockTransition.signature = value
  }

  static computeMinimumFee (
    numActions: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().ShieldFromAssetLockTransitionNAPI.computeMinimumFee(numActions, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawShieldFromAssetLockTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): ShieldFromAssetLockTransitionWASM {
    return ShieldFromAssetLockTransitionWASM.createFromRawInstance(
      proto().ShieldFromAssetLockTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldFromAssetLockTransitionNAPI): ShieldFromAssetLockTransitionWASM {
    const instance: ShieldFromAssetLockTransitionWASM = Object.create(ShieldFromAssetLockTransitionWASM.prototype)
    instance._rawShieldFromAssetLockTransition = rawInstance

    return instance
  }
}

class ShieldFromIdentityTransitionWASM {
  /** @private **/
  _rawShieldFromIdentityTransition: ShieldFromIdentityTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    amount: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array,
    nonce: bigint,
    userFeeIncrease?: number
  ) {
    this._rawShieldFromIdentityTransition = new (proto().ShieldFromIdentityTransitionNAPI)(
      prepareIdentifierValue(identityId),
      amount.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingSignature,
      nonce.toString(),
      userFeeIncrease
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawShieldFromIdentityTransition.identityId = prepareIdentifierValue(value)
  }

  get amount (): bigint {
    return BigInt(this._rawShieldFromIdentityTransition.amount)
  }

  set amount (value: bigint) {
    this._rawShieldFromIdentityTransition.amount = value.toString()
  }

  get actions (): SerializedActionWASM[] {
    return this._rawShieldFromIdentityTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawShieldFromIdentityTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawShieldFromIdentityTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawShieldFromIdentityTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawShieldFromIdentityTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.bindingsSignature = value
  }

  get nonce (): bigint {
    return BigInt(this._rawShieldFromIdentityTransition.nonce)
  }

  set nonce (value: bigint) {
    this._rawShieldFromIdentityTransition.nonce = value.toString()
  }

  get userFeeIncrease (): number {
    return this._rawShieldFromIdentityTransition.userFeeIncrease
  }

  set userFeeIncrease (value: number) {
    this._rawShieldFromIdentityTransition.userFeeIncrease = value
  }

  get signaturePublicKeyId (): number {
    return this._rawShieldFromIdentityTransition.signaturePublicKeyId
  }

  set signaturePublicKeyId (value: number) {
    this._rawShieldFromIdentityTransition.signaturePublicKeyId = value
  }

  get signature (): Uint8Array {
    return this._rawShieldFromIdentityTransition.signature
  }

  set signature (value: Uint8Array) {
    this._rawShieldFromIdentityTransition.signature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): ShieldFromIdentityTransitionWASM {
    return ShieldFromIdentityTransitionWASM.createFromRawInstance(
      proto().ShieldFromIdentityTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: ShieldFromIdentityTransitionNAPI): ShieldFromIdentityTransitionWASM {
    const instance: ShieldFromIdentityTransitionWASM = Object.create(ShieldFromIdentityTransitionWASM.prototype)
    instance._rawShieldFromIdentityTransition = rawInstance

    return instance
  }
}

class IdentityCreateFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawIdentityCreateFromShieldedPoolTransition: IdentityCreateFromShieldedPoolTransitionNAPI

  constructor (
    publicKeys: IdentityPublicKeyInCreationWASM[],
    denomination: bigint,
    actions: SerializedActionWASM[],
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingsSignature: Uint8Array,
    sendToAddressOnCreationFailure: PlatformAddressLike,
    identityId: IdentifierLike
  ) {
    this._rawIdentityCreateFromShieldedPoolTransition = new (proto().IdentityCreateFromShieldedPoolTransitionNAPI)(
      publicKeys.map(k => k._rawKeyInCreation),
      denomination.toString(),
      actions.map(a => a._rawSerializedAction),
      anchor,
      proof,
      bindingsSignature,
      preparePlatformAddressValue(sendToAddressOnCreationFailure),
      prepareIdentifierValue(identityId)
    )
  }

  get publicKeys (): IdentityPublicKeyInCreationWASM[] {
    return this._rawIdentityCreateFromShieldedPoolTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance)
  }

  set publicKeys (value: IdentityPublicKeyInCreationWASM[]) {
    this._rawIdentityCreateFromShieldedPoolTransition.publicKeys = value.map(k => k._rawKeyInCreation)
  }

  get denomination (): bigint {
    return BigInt(this._rawIdentityCreateFromShieldedPoolTransition.denomination)
  }

  set denomination (value: bigint) {
    this._rawIdentityCreateFromShieldedPoolTransition.denomination = value.toString()
  }

  get actions (): SerializedActionWASM[] {
    return this._rawIdentityCreateFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawIdentityCreateFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get anchor (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawIdentityCreateFromShieldedPoolTransition.bindingsSignature = value
  }

  get sendToAddressOnCreationFailure (): PlatformAddressWASM {
    return PlatformAddressWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure)
  }

  set sendToAddressOnCreationFailure (value: PlatformAddressLike) {
    this._rawIdentityCreateFromShieldedPoolTransition.sendToAddressOnCreationFailure = preparePlatformAddressValue(value)
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityCreateFromShieldedPoolTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawIdentityCreateFromShieldedPoolTransition.identityId = prepareIdentifierValue(value)
  }

  static computeMinimumFee (
    numActions: number,
    numKeys: number,
    platformVersion?: PlatformVersionNAPI
  ): bigint {
    return BigInt(proto().IdentityCreateFromShieldedPoolTransitionNAPI.computeMinimumFee(numActions, numKeys, platformVersion))
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(
      this._rawIdentityCreateFromShieldedPoolTransition.toStateTransition()
    )
  }

  static fromStateTransition (st: StateTransitionWASM): IdentityCreateFromShieldedPoolTransitionWASM {
    return IdentityCreateFromShieldedPoolTransitionWASM.createFromRawInstance(
      proto().IdentityCreateFromShieldedPoolTransitionNAPI.fromStateTransition(st._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityCreateFromShieldedPoolTransitionNAPI): IdentityCreateFromShieldedPoolTransitionWASM {
    const instance: IdentityCreateFromShieldedPoolTransitionWASM = Object.create(IdentityCreateFromShieldedPoolTransitionWASM.prototype)
    instance._rawIdentityCreateFromShieldedPoolTransition = rawInstance

    return instance
  }
}

class IdentityTopUpFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawIdentityTopUpFromShieldedPoolTransition: IdentityTopUpFromShieldedPoolTransitionNAPI

  constructor (
    identityId: IdentifierLike,
    actions: SerializedActionWASM[],
    topUpAmount: bigint,
    anchor: Uint8Array,
    proof: Uint8Array,
    bindingSignature: Uint8Array
  ) {
    this._rawIdentityTopUpFromShieldedPoolTransition = new (proto().IdentityTopUpFromShieldedPoolTransitionNAPI)(
      prepareIdentifierValue(identityId),
      actions.map(a => a._rawSerializedAction),
      topUpAmount.toString(),
      anchor,
      proof,
      bindingSignature
    )
  }

  get identityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.identityId)
  }

  set identityId (value: IdentifierLike) {
    this._rawIdentityTopUpFromShieldedPoolTransition.identityId = prepareIdentifierValue(value)
  }

  get actions (): SerializedActionWASM[] {
    return this._rawIdentityTopUpFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance)
  }

  set actions (value: SerializedActionWASM[]) {
    this._rawIdentityTopUpFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction)
  }

  get topUpAmount (): bigint {
    return BigInt(this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount)
  }

  set topUpAmount (value: bigint) {
    this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount = value.toString()
  }

  get anchor (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.anchor
  }

  set anchor (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.anchor = value
  }

  get proof (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.proof
  }

  set proof (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.proof = value
  }

  get bindingsSignature (): Uint8Array {
    return this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature
  }

  set bindingsSignature (value: Uint8Array) {
    this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature = value
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): IdentityTopUpFromShieldedPoolTransitionWASM {
    return IdentityTopUpFromShieldedPoolTransitionWASM.createFromRawInstance(
      proto().IdentityTopUpFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: IdentityTopUpFromShieldedPoolTransitionNAPI): IdentityTopUpFromShieldedPoolTransitionWASM {
    const instance: IdentityTopUpFromShieldedPoolTransitionWASM = Object.create(IdentityTopUpFromShieldedPoolTransitionWASM.prototype)
    instance._rawIdentityTopUpFromShieldedPoolTransition = rawInstance

    return instance
  }
}

class TokenPurchaseFromShieldedPoolTransitionWASM {
  /** @private **/
  _rawTokenPurchaseFromShieldedPoolTransition: TokenPurchaseFromShieldedPoolTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
    tokenCount: bigint,
    totalAgreedPrice: bigint,
    tokenActions: SerializedActionWASM[],
    tokenAnchor: Uint8Array,
    tokenProof: Uint8Array,
    tokenBindingSignature: Uint8Array,
    feeActions: SerializedActionWASM[],
    feeAnchor: Uint8Array,
    feeProof: Uint8Array,
    feeBindingSignature: Uint8Array,
    creditAmount: bigint
  ) {
    this._rawTokenPurchaseFromShieldedPoolTransition = new (proto().TokenPurchaseFromShieldedPoolTransitionNAPI)(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
      tokenCount.toString(),
      totalAgreedPrice.toString(),
      tokenActions.map(a => a._rawSerializedAction),
      tokenAnchor,
      tokenProof,
      tokenBindingSignature,
      feeActions.map(a => a._rawSerializedAction),
      feeAnchor,
      feeProof,
      feeBindingSignature,
      creditAmount.toString()
    )
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenPurchaseFromShieldedPoolTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenId = prepareIdentifierValue(value)
  }

  get tokenCount (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount)
  }

  set tokenCount (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenCount = value.toString()
  }

  get totalAgreedPrice (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice)
  }

  set totalAgreedPrice (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.totalAgreedPrice = value.toString()
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenPurchaseFromShieldedPoolTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenPurchaseFromShieldedPoolTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenPurchaseFromShieldedPoolTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenPurchaseFromShieldedPoolTransitionWASM {
    return TokenPurchaseFromShieldedPoolTransitionWASM.createFromRawInstance(
      proto().TokenPurchaseFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenPurchaseFromShieldedPoolTransitionNAPI): TokenPurchaseFromShieldedPoolTransitionWASM {
    const instance: TokenPurchaseFromShieldedPoolTransitionWASM = Object.create(TokenPurchaseFromShieldedPoolTransitionWASM.prototype)
    instance._rawTokenPurchaseFromShieldedPoolTransition = rawInstance

    return instance
  }
}

class TokenShieldedTransferWithShieldedFeeTransitionWASM {
  /** @private **/
  _rawTokenShieldedTransferWithShieldedFeeTransition: TokenShieldedTransferWithShieldedFeeTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
    tokenActions: SerializedActionWASM[],
    tokenAnchor: Uint8Array,
    tokenProof: Uint8Array,
    tokenBindingSignature: Uint8Array,
    feeActions: SerializedActionWASM[],
    feeAnchor: Uint8Array,
    feeProof: Uint8Array,
    feeBindingSignature: Uint8Array,
    creditAmount: bigint
  ) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition = new (proto().TokenShieldedTransferWithShieldedFeeTransitionNAPI)(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
      tokenActions.map(a => a._rawSerializedAction),
      tokenAnchor,
      tokenProof,
      tokenBindingSignature,
      feeActions.map(a => a._rawSerializedAction),
      feeAnchor,
      feeProof,
      feeBindingSignature,
      creditAmount.toString()
    )
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value)
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenShieldedTransferWithShieldedFeeTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenShieldedTransferWithShieldedFeeTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenShieldedTransferWithShieldedFeeTransitionWASM {
    return TokenShieldedTransferWithShieldedFeeTransitionWASM.createFromRawInstance(
      proto().TokenShieldedTransferWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenShieldedTransferWithShieldedFeeTransitionNAPI): TokenShieldedTransferWithShieldedFeeTransitionWASM {
    const instance: TokenShieldedTransferWithShieldedFeeTransitionWASM = Object.create(TokenShieldedTransferWithShieldedFeeTransitionWASM.prototype)
    instance._rawTokenShieldedTransferWithShieldedFeeTransition = rawInstance

    return instance
  }
}

class TokenUnshieldWithShieldedFeeTransitionWASM {
  /** @private **/
  _rawTokenUnshieldWithShieldedFeeTransition: TokenUnshieldWithShieldedFeeTransitionNAPI

  constructor (
    dataContractId: IdentifierLike,
    tokenContractPosition: number,
    tokenId: IdentifierLike,
    recipientId: IdentifierLike,
    amount: bigint,
    tokenActions: SerializedActionWASM[],
    tokenAnchor: Uint8Array,
    tokenProof: Uint8Array,
    tokenBindingSignature: Uint8Array,
    feeActions: SerializedActionWASM[],
    feeAnchor: Uint8Array,
    feeProof: Uint8Array,
    feeBindingSignature: Uint8Array,
    creditAmount: bigint
  ) {
    this._rawTokenUnshieldWithShieldedFeeTransition = new (proto().TokenUnshieldWithShieldedFeeTransitionNAPI)(
      prepareIdentifierValue(dataContractId),
      tokenContractPosition,
      prepareIdentifierValue(tokenId),
      prepareIdentifierValue(recipientId),
      amount.toString(),
      tokenActions.map(a => a._rawSerializedAction),
      tokenAnchor,
      tokenProof,
      tokenBindingSignature,
      feeActions.map(a => a._rawSerializedAction),
      feeAnchor,
      feeProof,
      feeBindingSignature,
      creditAmount.toString()
    )
  }

  get dataContractId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId)
  }

  set dataContractId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.dataContractId = prepareIdentifierValue(value)
  }

  get tokenContractPosition (): number {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition
  }

  set tokenContractPosition (value: number) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenContractPosition = value
  }

  get tokenId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.tokenId)
  }

  set tokenId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenId = prepareIdentifierValue(value)
  }

  get recipientId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.recipientId)
  }

  set recipientId (value: IdentifierLike) {
    this._rawTokenUnshieldWithShieldedFeeTransition.recipientId = prepareIdentifierValue(value)
  }

  get amount (): bigint {
    return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.amount)
  }

  set amount (value: bigint) {
    this._rawTokenUnshieldWithShieldedFeeTransition.amount = value.toString()
  }

  get tokenActions (): SerializedActionWASM[] {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set tokenActions (value: SerializedActionWASM[]) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenActions = value.map(a => a._rawSerializedAction)
  }

  get tokenAnchor (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor
  }

  set tokenAnchor (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenAnchor = value
  }

  get tokenProof (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof
  }

  set tokenProof (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenProof = value
  }

  get tokenBindingSignature (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature
  }

  set tokenBindingSignature (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.tokenBindingSignature = value
  }

  get feeActions (): SerializedActionWASM[] {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeActions.map(SerializedActionWASM.createFromRawInstance)
  }

  set feeActions (value: SerializedActionWASM[]) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeActions = value.map(a => a._rawSerializedAction)
  }

  get feeAnchor (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor
  }

  set feeAnchor (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeAnchor = value
  }

  get feeProof (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeProof
  }

  set feeProof (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeProof = value
  }

  get feeBindingSignature (): Uint8Array {
    return this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature
  }

  set feeBindingSignature (value: Uint8Array) {
    this._rawTokenUnshieldWithShieldedFeeTransition.feeBindingSignature = value
  }

  get creditAmount (): bigint {
    return BigInt(this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount)
  }

  set creditAmount (value: bigint) {
    this._rawTokenUnshieldWithShieldedFeeTransition.creditAmount = value.toString()
  }

  toStateTransition (): StateTransitionWASM {
    return StateTransitionWASM.createFromRawInstance(this._rawTokenUnshieldWithShieldedFeeTransition.toStateTransition())
  }

  static fromStateTransition (stateTransition: StateTransitionWASM): TokenUnshieldWithShieldedFeeTransitionWASM {
    return TokenUnshieldWithShieldedFeeTransitionWASM.createFromRawInstance(
      proto().TokenUnshieldWithShieldedFeeTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition)
    )
  }

  static createFromRawInstance (rawInstance: TokenUnshieldWithShieldedFeeTransitionNAPI): TokenUnshieldWithShieldedFeeTransitionWASM {
    const instance: TokenUnshieldWithShieldedFeeTransitionWASM = Object.create(TokenUnshieldWithShieldedFeeTransitionWASM.prototype)
    instance._rawTokenUnshieldWithShieldedFeeTransition = rawInstance

    return instance
  }
}

  // ---------------------------------------------------------------------------
  // Shielded output: the standalone package takes memo bytes; the suites use
  // the old memo wrapper, so adapt both sides.
  // ---------------------------------------------------------------------------
  class ShieldedOutputWASM {
    /** The shielded package wrapper (keeps its own memo-byte handling). */
    _shieldedOutput: any

    constructor (address: any, amount: bigint, memo: any) {
      this._shieldedOutput = new shielded.ShieldedOutputWASM(address, amount, memo.toBytes())
    }

    /** Raw NAPI output, as consumed by the standalone builder. */
    get _rawShieldedOutput (): any {
      return this._shieldedOutput._rawShieldedOutput
    }

    get address (): any {
      return this._shieldedOutput.address
    }

    set address (value: any) {
      this._shieldedOutput.address = value
    }

    get amount (): bigint {
      return this._shieldedOutput.amount
    }

    set amount (value: bigint) {
      this._shieldedOutput.amount = value
    }

    get memo (): any {
      return ShieldedMemoWASM.fromBytes(this._shieldedOutput.memo)
    }

    set memo (value: any) {
      this._shieldedOutput.memo = value.toBytes()
    }

    static createFromRawInstance (rawInstance: any): ShieldedOutputWASM {
      const instance: ShieldedOutputWASM = Object.create(ShieldedOutputWASM.prototype)
      instance._shieldedOutput = new shielded.ShieldedOutputWASM(
        rawInstance.address,
        rawInstance.amount,
        rawInstance.memo
      )

      return instance
    }
  }

  // ---------------------------------------------------------------------------
  // Proving results returned by the standalone builder are dpp-free; wrap them
  // back into the dpp value objects the suites assert on.
  // ---------------------------------------------------------------------------
  class ShieldedWithdrawalResultWASM {
    /** @private **/
    _rawShieldedWithdrawalResult: ShieldedWithdrawalResultNAPI

    constructor (rawInstance: any) {
      this._rawShieldedWithdrawalResult = rawInstance
    }

    get stateTransition (): any {
      return stateTransitionFromBytes(this._rawShieldedWithdrawalResult.stateTransition)
    }

    get fee (): bigint {
      return BigInt(this._rawShieldedWithdrawalResult.fee)
    }

    static createFromRawInstance (rawInstance: any): ShieldedWithdrawalResultWASM {
      return new ShieldedWithdrawalResultWASM(rawInstance)
    }
  }

  class IdentityCreateFromShieldedPoolResultWASM {
    /** @private **/
    _rawIdentityCreateFromShieldedPoolResult: IdentityCreateFromShieldedPoolResultNAPI

    constructor (rawInstance: any) {
      this._rawIdentityCreateFromShieldedPoolResult = rawInstance
    }

    get publicKeys (): any[] {
      return this._rawIdentityCreateFromShieldedPoolResult.publicKeys.map(
        (bytes: Uint8Array) => keyInCreationFromBytes(bytes)
      )
    }

    get identityId (): any {
      return identifierFromBytes(this._rawIdentityCreateFromShieldedPoolResult.identityId)
    }

    get predictedFee (): bigint {
      return BigInt(this._rawIdentityCreateFromShieldedPoolResult.predictedFee)
    }

    get actions (): any[] {
      return this._rawIdentityCreateFromShieldedPoolResult.actions.map(
        (bytes: Uint8Array) => serializedActionFromBytes(bytes)
      )
    }

    get anchor (): Uint8Array {
      return this._rawIdentityCreateFromShieldedPoolResult.anchor
    }

    get proof (): Uint8Array {
      return this._rawIdentityCreateFromShieldedPoolResult.proof
    }

    get bindingsSignature (): Uint8Array {
      return this._rawIdentityCreateFromShieldedPoolResult.bindingsSignature
    }

    static createFromRawInstance (rawInstance: any): IdentityCreateFromShieldedPoolResultWASM {
      return new IdentityCreateFromShieldedPoolResultWASM(rawInstance)
    }
  }

  // ---------------------------------------------------------------------------
  // recoverNotes takes base SerializedActionWASM values in the suites; the
  // standalone package takes raw action bytes.
  // ---------------------------------------------------------------------------
  function recoverNotes (actions: any[], seed: Uint8Array, coinType: number, account: number): any[] {
    return shielded.recoverNotes(
      actions.map((action: any) => action instanceof Uint8Array ? action : action.bytes()),
      seed,
      coinType,
      account
    )
  }

  // ---------------------------------------------------------------------------
  // The standalone builder returns raw transition bytes / dpp-free results;
  // wrap them back into dpp value objects so the suites can assert on them.
  // ---------------------------------------------------------------------------
  class ShieldedBuilderWASM {
    /** Delegated-to standalone builder. */
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
      ShieldedBuilderWASM._initPromise = (async () => {
        const builder = new shielded.ShieldedBuilderWASM()
        await builder.init()
        return builder
      })().catch((e: Error) => {
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.shieldFromAssetLock(
        recipient,
        shieldAmount.toString(),
        assetLockProof.bytes(),
        privateKey.bytes(),
        memo.toBytes(),
        dummyOutputs,
        senderOvk,
        surplusOutput != null ? new PlatformAddressWASM(surplusOutput).bytes() : undefined,
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.shield(
        recipient,
        shieldAmount.toString(),
        inputs.map(i => i.bytes()),
        privateKeys.map(k => k.bytes()),
        feeStrategy.map(s => s.bytes()),
        userFeeIncrease,
        memo.toBytes(),
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
        spends,
        withdrawalAmount.toString(),
        outputScript.bytes(),
        coreFeePerByte,
        pooling,
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
        spends,
        new PlatformAddressWASM(outputAddress).bytes(),
        unshieldAmount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
        spends,
        recipient,
        transferAmount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
        spends,
        outputs,
        changeAddress,
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
        publicKeys.map(k => k.bytes()),
        privateKeys.map(k => k.bytes()),
        denomination.toString(),
        new PlatformAddressWASM(sendToAddressOnCreationFailure).bytes(),
        spends,
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.shieldFromIdentity(
        identity.bytes(),
        recipient,
        shieldAmount.toString(),
        nonce.toString(),
        signingKey.bytes(),
        privateKey.bytes(),
        userFeeIncrease,
        memo.toBytes(),
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
        spends,
        new IdentifierWASM(identityId).bytes(),
        topUpAmount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
    return tokenPaymentFromBytes(
      await this._rawShieldedBuilder.documentTokenPayment(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        new IdentifierWASM(documentId).bytes(),
        spends,
        amount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenShield(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        recipient,
        amount.toString(),
        memo.toBytes(),
        senderOvk,
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenUnshield(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        spends,
        new IdentifierWASM(recipientId).bytes(),
        amount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenShieldedTransfer(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        spends,
        recipient,
        transferAmount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenMintToPool(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        recipient,
        amount.toString(),
        memo.toBytes(),
        senderOvk,
        publicNote,
        usingGroupInfo?.bytes(),
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenBurnFromPool(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        spends,
        amount.toString(),
        changeAddress,
        seed,
        coinType,
        account,
        anchor,
        memo.toBytes(),
        publicNote,
        usingGroupInfo?.bytes(),
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenClaimToPool(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        recipient,
        amount.toString(),
        distributionType,
        claimUpTo?.toString(),
        memo.toBytes(),
        senderOvk,
        publicNote,
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
    return stateTransitionFromBytes(
      await this._rawShieldedBuilder.tokenDirectPurchaseToPool(
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(ownerId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        recipient,
        tokenCount.toString(),
        totalAgreedPrice.toString(),
        memo.toBytes(),
        senderOvk,
        identityPublicKey.bytes(),
        privateKey.bytes(),
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
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        tokenSpends,
        tokenChangeAddress,
        tokenAnchor,
        recipient,
        transferAmount.toString(),
        feeSpends,
        feeChangeAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo.toBytes(),
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
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        tokenSpends,
        tokenChangeAddress,
        tokenAnchor,
        new IdentifierWASM(recipientId).bytes(),
        amount.toString(),
        feeSpends,
        feeChangeAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo.toBytes(),
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
        new IdentifierWASM(tokenId).bytes(),
        new IdentifierWASM(dataContractId).bytes(),
        tokenContractPosition,
        recipient,
        tokenCount.toString(),
        totalAgreedPrice.toString(),
        feeSpends,
        feeChangeAddress,
        feeAnchor,
        seed,
        coinType,
        account,
        memo.toBytes(),
        platformVersion
      )
    )
  }
}

  return {
    // Orchard data classes (re-exported so the suites keep one import site).
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
    // Adapted shielded classes.
    ShieldedMemoWASM,
    ShieldedOutputWASM,
    ShieldedBuilderWASM,
    ShieldedWithdrawalResultWASM,
    IdentityCreateFromShieldedPoolResultWASM,
    recoverNotes,
    // Base transition wrappers.
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
  }
}
