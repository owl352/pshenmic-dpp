import type { AddressFundingFromAssetLockTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressNullableCreditsWASM } from './entities/OutputAddressNullableCredits.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class AddressFundingFromAssetLockTransitionWASM {
    /** @private **/
    _rawAddressFundingFromAssetLockTransition: AddressFundingFromAssetLockTransitionNAPI;
    constructor(assetLockProof: AssetLockProofWASM, inputs: InputAddressWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], userFeeIncrease: number, inputWitness: AddressWitnessWASM[], outputs: OutputAddressNullableCreditsWASM[]);
    get assetLockProof(): AssetLockProofWASM;
    set assetLockProof(assetLockProof: AssetLockProofWASM);
    get inputs(): InputAddressWASM[];
    set inputs(inputs: InputAddressWASM[]);
    get outputs(): OutputAddressNullableCreditsWASM[];
    set outputs(outputs: OutputAddressNullableCreditsWASM[]);
    get feeStrategy(): AddressFundsFeeStrategyStepWASM[];
    set feeStrategy(feeStrategy: AddressFundsFeeStrategyStepWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get inputWitness(): AddressWitnessWASM[];
    set inputWitness(value: AddressWitnessWASM[]);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): AddressFundingFromAssetLockTransitionWASM;
    static fromHex(hex: string): AddressFundingFromAssetLockTransitionWASM;
    static fromBase64(base64: string): AddressFundingFromAssetLockTransitionWASM;
    static fromStateTransition(stateTransition: StateTransitionWASM): AddressFundingFromAssetLockTransitionWASM;
    static createFromRawInstance(rawInstance: AddressFundingFromAssetLockTransitionNAPI): AddressFundingFromAssetLockTransitionWASM;
}
