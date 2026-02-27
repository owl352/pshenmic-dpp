import type { AddressFundsTransferTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class AddressFundsTransferTransitionWASM {
    /** @private **/
    _rawAddressFundsTransferTransition: AddressFundsTransferTransitionNAPI;
    constructor(inputs: InputAddressWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], userFeeIncrease: number, inputWitness: AddressWitnessWASM[], outputs: OutputAddressWASM[]);
    get inputs(): InputAddressWASM[];
    set inputs(inputs: InputAddressWASM[]);
    get outputs(): OutputAddressWASM[];
    set outputs(outputs: OutputAddressWASM[]);
    get feeStrategy(): AddressFundsFeeStrategyStepWASM[];
    set feeStrategy(feeStrategy: AddressFundsFeeStrategyStepWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get inputWitness(): AddressWitnessWASM[];
    set inputWitness(witness: AddressWitnessWASM[]);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): AddressFundsTransferTransitionWASM;
    static fromHex(hex: string): AddressFundsTransferTransitionWASM;
    static fromBase64(base64: string): AddressFundsTransferTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): AddressFundsTransferTransitionWASM;
    static createFromRawInstance(rawInstance: AddressFundsTransferTransitionNAPI): AddressFundsTransferTransitionWASM;
}
