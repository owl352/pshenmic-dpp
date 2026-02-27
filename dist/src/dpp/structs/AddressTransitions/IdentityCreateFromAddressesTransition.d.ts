import type { IdentityCreateFromAddressesTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentityPublicKeyInCreationWASM } from '../IdentityPublicKeyInCreation.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class IdentityCreateFromAddressesTransitionWASM {
    /** @private **/
    _rawIdentityCreateFromAddressesTransition: IdentityCreateFromAddressesTransitionNAPI;
    constructor(identityPublicKeysInCreation: IdentityPublicKeyInCreationWASM[], inputs: InputAddressWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], userFeeIncrease: number, inputWitness: AddressWitnessWASM[], output?: OutputAddressWASM);
    get publicKeys(): IdentityPublicKeyInCreationWASM[];
    set publicKeys(publicKeys: IdentityPublicKeyInCreationWASM[]);
    get inputs(): InputAddressWASM[];
    set inputs(inputs: InputAddressWASM[]);
    get output(): OutputAddressWASM | undefined;
    set output(output: OutputAddressWASM | undefined);
    get feeStrategy(): AddressFundsFeeStrategyStepWASM[];
    set feeStrategy(feeStrategy: AddressFundsFeeStrategyStepWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get inputWitness(): AddressWitnessWASM[];
    set inputWitness(value: AddressWitnessWASM[]);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): IdentityCreateFromAddressesTransitionWASM;
    static fromHex(hex: string): IdentityCreateFromAddressesTransitionWASM;
    static fromBase64(base64: string): IdentityCreateFromAddressesTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): IdentityCreateFromAddressesTransitionWASM;
    static createFromRawInstance(rawInstance: IdentityCreateFromAddressesTransitionNAPI): IdentityCreateFromAddressesTransitionWASM;
}
