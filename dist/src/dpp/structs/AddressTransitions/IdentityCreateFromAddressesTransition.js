import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { dppProvider } from '../../provider.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class IdentityCreateFromAddressesTransitionWASM {
    /** @private **/
    _rawIdentityCreateFromAddressesTransition;
    constructor(identityPublicKeysInCreation, inputs, feeStrategy, userFeeIncrease, inputWitness, output) {
        this._rawIdentityCreateFromAddressesTransition = new dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI(identityPublicKeysInCreation.map(k => k._rawKeyInCreation), inputs.map(i => i._rawInputAddress), feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep), userFeeIncrease, inputWitness.map(w => w._rawWitness), output?._rawOutputAddress);
    }
    get publicKeys() {
        return this._rawIdentityCreateFromAddressesTransition.publicKeys.map(IdentityPublicKeyInCreationWASM.createFromRawInstance);
    }
    set publicKeys(publicKeys) {
        this._rawIdentityCreateFromAddressesTransition.publicKeys = publicKeys.map(k => k._rawKeyInCreation);
    }
    get inputs() {
        return this._rawIdentityCreateFromAddressesTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(inputs) {
        this._rawIdentityCreateFromAddressesTransition.inputs = inputs.map(i => i._rawInputAddress);
    }
    get output() {
        const output = this._rawIdentityCreateFromAddressesTransition.output;
        if (output != null) {
            return OutputAddressWASM.createFromRawInstance(output);
        }
    }
    set output(output) {
        this._rawIdentityCreateFromAddressesTransition.output = output?._rawOutputAddress;
    }
    get feeStrategy() {
        return this._rawIdentityCreateFromAddressesTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(feeStrategy) {
        this._rawIdentityCreateFromAddressesTransition.feeStrategy = feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawIdentityCreateFromAddressesTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityCreateFromAddressesTransition.userFeeIncrease = value;
    }
    get inputWitness() {
        return this._rawIdentityCreateFromAddressesTransition.inputWitness.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitness(value) {
        this._rawIdentityCreateFromAddressesTransition.inputWitness = value.map(w => w._rawWitness);
    }
    bytes() {
        return this._rawIdentityCreateFromAddressesTransition.bytes();
    }
    hex() {
        return this._rawIdentityCreateFromAddressesTransition.hex();
    }
    base64() {
        return this._rawIdentityCreateFromAddressesTransition.base64();
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityCreateFromAddressesTransition.toStateTransition());
    }
    static fromBytes(bytes) {
        return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromBase64(base64));
    }
    static fromStateTransition(stateTransition) {
        return IdentityCreateFromAddressesTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityCreateFromAddressesTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityCreateFromAddressesTransitionWASM.prototype);
        instance._rawIdentityCreateFromAddressesTransition = rawInstance;
        return instance;
    }
}
