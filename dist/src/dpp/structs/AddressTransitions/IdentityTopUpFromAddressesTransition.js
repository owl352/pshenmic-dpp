import { dppProvider } from '../../provider.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { prepareIdentifierValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityTopUpFromAddressesTransitionWASM {
    /** @private **/
    _rawIdentityTopUpFromAddressesTransition;
    constructor(identifier, inputs, feeStrategy, userFeeIncrease, inputWitness, output) {
        this._rawIdentityTopUpFromAddressesTransition = new dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI(prepareIdentifierValue(identifier), inputs.map(i => i._rawInputAddress), feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep), userFeeIncrease, inputWitness.map(w => w._rawWitness), output?._rawOutputAddress);
    }
    get inputs() {
        return this._rawIdentityTopUpFromAddressesTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(inputs) {
        this._rawIdentityTopUpFromAddressesTransition.inputs = inputs.map(i => i._rawInputAddress);
    }
    get output() {
        const output = this._rawIdentityTopUpFromAddressesTransition.output;
        if (output != null) {
            return OutputAddressWASM.createFromRawInstance(output);
        }
    }
    set output(output) {
        this._rawIdentityTopUpFromAddressesTransition.output = output?._rawOutputAddress;
    }
    get feeStrategy() {
        return this._rawIdentityTopUpFromAddressesTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(feeStrategy) {
        this._rawIdentityTopUpFromAddressesTransition.feeStrategy = feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawIdentityTopUpFromAddressesTransition.userFeeIncrease;
    }
    set userFeeIncrease(userFeeIncrease) {
        this._rawIdentityTopUpFromAddressesTransition.userFeeIncrease = userFeeIncrease;
    }
    get inputWitness() {
        return this._rawIdentityTopUpFromAddressesTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitness(addressWitness) {
        this._rawIdentityTopUpFromAddressesTransition.inputWitness = addressWitness.map(w => w._rawWitness);
    }
    bytes() {
        return this._rawIdentityTopUpFromAddressesTransition.bytes();
    }
    hex() {
        return this._rawIdentityTopUpFromAddressesTransition.hex();
    }
    base64() {
        return this._rawIdentityTopUpFromAddressesTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityTopUpFromAddressesTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityTopUpFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpFromAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityTopUpFromAddressesTransitionWASM.prototype);
        instance._rawIdentityTopUpFromAddressesTransition = rawInstance;
        return instance;
    }
}
