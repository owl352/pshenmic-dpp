import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressNullableCreditsWASM } from './entities/OutputAddressNullableCredits.js';
import { dppProvider } from '../../provider.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class AddressFundingFromAssetLockTransitionWASM {
    /** @private **/
    _rawAddressFundingFromAssetLockTransition;
    constructor(assetLockProof, inputs, feeStrategy, userFeeIncrease, inputWitness, outputs) {
        this._rawAddressFundingFromAssetLockTransition = new dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI(assetLockProof._rawAssetLockProof, inputs.map(i => i._rawInputAddress), feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep), userFeeIncrease, inputWitness.map(i => i._rawWitness), outputs.map(o => o._rawOutputAddressNullableCredits));
    }
    get assetLockProof() {
        return AssetLockProofWASM.createFromRawInstance(this._rawAddressFundingFromAssetLockTransition.assetLockProof);
    }
    set assetLockProof(assetLockProof) {
        this._rawAddressFundingFromAssetLockTransition.assetLockProof = assetLockProof._rawAssetLockProof;
    }
    get inputs() {
        return this._rawAddressFundingFromAssetLockTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(inputs) {
        this._rawAddressFundingFromAssetLockTransition.inputs = inputs.map(i => i._rawInputAddress);
    }
    get outputs() {
        return this._rawAddressFundingFromAssetLockTransition.outputs.map(OutputAddressNullableCreditsWASM.createFromRawInstance);
    }
    set outputs(outputs) {
        this._rawAddressFundingFromAssetLockTransition.outputs = outputs.map(o => o._rawOutputAddressNullableCredits);
    }
    get feeStrategy() {
        return this._rawAddressFundingFromAssetLockTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(feeStrategy) {
        this._rawAddressFundingFromAssetLockTransition.feeStrategy = feeStrategy.map(step => step._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawAddressFundingFromAssetLockTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawAddressFundingFromAssetLockTransition.userFeeIncrease = value;
    }
    get inputWitness() {
        return this._rawAddressFundingFromAssetLockTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitness(value) {
        this._rawAddressFundingFromAssetLockTransition.inputWitness = value.map(w => w._rawWitness);
    }
    get signature() {
        return this._rawAddressFundingFromAssetLockTransition.signature;
    }
    set signature(value) {
        this._rawAddressFundingFromAssetLockTransition.signature = value;
    }
    bytes() {
        return this._rawAddressFundingFromAssetLockTransition.bytes();
    }
    hex() {
        return this._rawAddressFundingFromAssetLockTransition.hex();
    }
    base64() {
        return this._rawAddressFundingFromAssetLockTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawAddressFundingFromAssetLockTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return AddressFundingFromAssetLockTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundingFromAssetLockTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(AddressFundingFromAssetLockTransitionWASM.prototype);
        instance._rawAddressFundingFromAssetLockTransition = rawInstance;
        return instance;
    }
}
