import type { AddressCreditWithdrawalTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { InputAddressWASM } from './entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from './entities/AddressFundsFeeStrategyStep.js';
import { PoolingLike } from '../../types.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { AddressWitnessWASM } from '../Address/AddressWitness.js';
import { OutputAddressWASM } from './entities/OutputAddress.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class AddressCreditWithdrawalTransitionWASM {
    /** @private **/
    _rawAddressCreditWithdrawalTransition: AddressCreditWithdrawalTransitionNAPI;
    constructor(inputs: InputAddressWASM[], feeStrategy: AddressFundsFeeStrategyStepWASM[], coreFeePerByte: number, pooling: PoolingLike, outputScript: CoreScriptWASM, userFeeIncrease: number, inputWitness: AddressWitnessWASM[], output?: OutputAddressWASM);
    get coreFeePerByte(): number;
    set coreFeePerByte(value: number);
    get pooling(): string;
    set pooling(value: PoolingLike);
    get outputScript(): CoreScriptWASM;
    set outputScript(value: CoreScriptWASM);
    get inputs(): InputAddressWASM[];
    set inputs(value: InputAddressWASM[]);
    get output(): OutputAddressWASM | undefined;
    set output(value: OutputAddressWASM | undefined);
    get feeStrategy(): AddressFundsFeeStrategyStepWASM[];
    set feeStrategy(value: AddressFundsFeeStrategyStepWASM[]);
    get userFeeIncrease(): number;
    set userFeeIncrease(value: number);
    get inputWitness(): AddressWitnessWASM[];
    set inputWitness(value: AddressWitnessWASM[]);
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    toStateTransition(): StateTransitionWASM;
    static fromBytes(bytes: Uint8Array): AddressCreditWithdrawalTransitionWASM;
    static fromHex(hex: string): AddressCreditWithdrawalTransitionWASM;
    static fromBase64(base64: string): AddressCreditWithdrawalTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): AddressCreditWithdrawalTransitionWASM;
    static createFromRawInstance(rawInstance: AddressCreditWithdrawalTransitionNAPI): AddressCreditWithdrawalTransitionWASM;
}
