import type { WitnessNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class WitnessWASM {
    /** @private **/
    _rawWitness: WitnessNAPI;
    constructor(bytes?: Uint8Array[]);
    getBytes(): Uint8Array[];
    isEmpty(): boolean;
    clear(): void;
    push(value: Uint8Array): void;
    static createFromRawInstance(rawInstance: WitnessNAPI): WitnessWASM;
}
