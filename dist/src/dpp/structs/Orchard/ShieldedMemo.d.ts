import type { ShieldedMemoNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class ShieldedMemoWASM {
    /** @private **/
    _rawShieldedMemo: ShieldedMemoNAPI;
    toString(): string;
    toBytes(): Uint8Array;
    static empty(): ShieldedMemoWASM;
    static fromString(value: string): ShieldedMemoWASM;
    static other(kind: number, payload: Uint8Array): ShieldedMemoWASM;
    static fromBytes(bytes: Uint8Array): ShieldedMemoWASM;
    static createFromRawInstance(rawInstance: ShieldedMemoNAPI): ShieldedMemoWASM;
}
