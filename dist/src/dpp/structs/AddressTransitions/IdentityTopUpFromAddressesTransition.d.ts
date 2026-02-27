import type { IdentityTopUpFromAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityTopUpFromAddressesTransitionWASM {
    /** @private **/
    _rawIdentityTopUpFromAddressesTransition: IdentityTopUpFromAddressesTransitionNAPI;
    constructor(identifier: IdentifierLike, inputs: InputAddressWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], userFeeIncrease: number, inputWitness: AddressWitnessWASM[], output?: OutputAddressWASM);
    get inputs(): InputAddressWASM[];
    set inputs(inputs: InputAddressWASM[]);
    get output(): OutputAddressWASM | undefined;
    set output(output: OutputAddressWASM | undefined);
    get feeStrategy(): AddressFundsFeeStrategyStepWASM[];
    set feeStrategy(feeStrategy: AddressFundsFeeStrategyStepWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(userFeeIncrease: number);
    get inputWitness(): AddressWitnessWASM[];
    set inputWitness(addressWitness: AddressWitnessWASM[]);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityTopUpFromAddressesTransitionWASM;
    static fromHex(hex: string): IdentityTopUpFromAddressesTransitionWASM;
    static fromBase64(base64: string): IdentityTopUpFromAddressesTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityTopUpFromAddressesTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityTopUpFromAddressesTransitionNAPI): IdentityTopUpFromAddressesTransitionWASM;
}
