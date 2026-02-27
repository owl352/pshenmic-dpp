import type { AddressWitnessNAPI } from '../../../../binaries/bindingsTypes.js';
import { AddressWitnessP2PKH, AddressWitnessP2SH } from '../../types.js';
export declare class AddressWitnessWASM {
    /** @private **/
    _rawWitness: AddressWitnessNAPI;
    private constructor();
    P2PKH(signature: Uint8Array): AddressWitnessWASM;
    P2SH(signatures: Uint8Array[], redeemScript: Uint8Array): AddressWitnessWASM;
    getType(): string;
    getValue(): AddressWitnessP2PKH | AddressWitnessP2SH;
    static createFromRawInstance(rawInstance: AddressWitnessNAPI): AddressWitnessWASM;
}
