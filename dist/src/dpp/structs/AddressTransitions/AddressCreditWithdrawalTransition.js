import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class AddressCreditWithdrawalTransitionWASM {
    /** @private **/
    _rawAddressCreditWithdrawalTransition;
    constructor(inputs, feeStrategy, coreFeePerByte, pooling, outputScript, userFeeIncrease, inputWitness, output) {
        this._rawAddressCreditWithdrawalTransition = new dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI(inputs.map(input => input._rawInputAddress), feeStrategy.map(step => step._rawAddressFundsFeeStrategyStep), coreFeePerByte, valueToDynamicValue(pooling), outputScript._rawCoreScript, userFeeIncrease, inputWitness.map(witness => witness._rawWitness), output?._rawOutputAddress);
    }
    get coreFeePerByte() {
        return this._rawAddressCreditWithdrawalTransition.coreFeePerByte;
    }
    set coreFeePerByte(value) {
        this._rawAddressCreditWithdrawalTransition.coreFeePerByte = value;
    }
    get pooling() {
        return this._rawAddressCreditWithdrawalTransition.pooling;
    }
    set pooling(value) {
        this._rawAddressCreditWithdrawalTransition.pooling = valueToDynamicValue(value);
    }
    get outputScript() {
        return CoreScriptWASM.createFromRawInstance(this._rawAddressCreditWithdrawalTransition.outputScript);
    }
    set outputScript(value) {
        this._rawAddressCreditWithdrawalTransition.outputScript = value._rawCoreScript;
    }
    get inputs() {
        return this._rawAddressCreditWithdrawalTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(value) {
        this._rawAddressCreditWithdrawalTransition.inputs = value.map(input => input._rawInputAddress);
    }
    get output() {
        const output = this._rawAddressCreditWithdrawalTransition.output;
        if (output != null) {
            return OutputAddressWASM.createFromRawInstance(output);
        }
    }
    set output(value) {
        this._rawAddressCreditWithdrawalTransition.output = value?._rawOutputAddress;
    }
    get feeStrategy() {
        return this._rawAddressCreditWithdrawalTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(value) {
        this._rawAddressCreditWithdrawalTransition.feeStrategy = value.map(step => step._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawAddressCreditWithdrawalTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawAddressCreditWithdrawalTransition.userFeeIncrease = value;
    }
    get inputWitness() {
        return this._rawAddressCreditWithdrawalTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitness(value) {
        this._rawAddressCreditWithdrawalTransition.inputWitness = value.map(witness => witness._rawWitness);
    }
    bytes() {
        return this._rawAddressCreditWithdrawalTransition.bytes();
    }
    hex() {
        return this._rawAddressCreditWithdrawalTransition.hex();
    }
    base64() {
        return this._rawAddressCreditWithdrawalTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawAddressCreditWithdrawalTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(st) {
        return AddressCreditWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.AddressCreditWithdrawalTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(AddressCreditWithdrawalTransitionWASM.prototype);
        instance._rawAddressCreditWithdrawalTransition = rawInstance;
        return instance;
    }
}
