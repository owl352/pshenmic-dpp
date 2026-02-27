import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { dppProvider } from '../../provider.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class AddressFundsTransferTransitionWASM {
    /** @private **/
    _rawAddressFundsTransferTransition;
    constructor(inputs, feeStrategy, userFeeIncrease, inputWitness, outputs) {
        this._rawAddressFundsTransferTransition = new dppProvider.dpp.AddressFundsTransferTransitionNAPI(inputs.map(i => i._rawInputAddress), feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep), userFeeIncrease, inputWitness.map(w => w._rawWitness), outputs.map(o => o._rawOutputAddress));
    }
    get inputs() {
        return this._rawAddressFundsTransferTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(inputs) {
        this._rawAddressFundsTransferTransition.inputs = inputs.map(i => i._rawInputAddress);
    }
    get outputs() {
        return this._rawAddressFundsTransferTransition.outputs.map(OutputAddressWASM.createFromRawInstance);
    }
    set outputs(outputs) {
        this._rawAddressFundsTransferTransition.outputs = outputs.map(o => o._rawOutputAddress);
    }
    get feeStrategy() {
        return this._rawAddressFundsTransferTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(feeStrategy) {
        this._rawAddressFundsTransferTransition.feeStrategy = feeStrategy.map(f => f._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawAddressFundsTransferTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawAddressFundsTransferTransition.userFeeIncrease = value;
    }
    get inputWitness() {
        return this._rawAddressFundsTransferTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitness(witness) {
        this._rawAddressFundsTransferTransition.inputWitness = witness.map(w => w._rawWitness);
    }
    bytes() {
        return this._rawAddressFundsTransferTransition.bytes();
    }
    hex() {
        return this._rawAddressFundsTransferTransition.hex();
    }
    base64() {
        return this._rawAddressFundsTransferTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawAddressFundsTransferTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return AddressFundsTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return AddressFundsTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return AddressFundsTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return AddressFundsTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressFundsTransferTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(AddressFundsTransferTransitionWASM.prototype);
        instance._rawAddressFundsTransferTransition = rawInstance;
        return instance;
    }
}
