import type { ShieldedProverNAPI } from 'dash-platform-shielded/bindingsTypes';
/**
 * Reusable shielded prover holding the Halo 2 proving key. Building it is
 * expensive (~seconds); construct once and reuse. (The `ShieldedBuilderWASM`
 * already builds its own prover internally — this is exposed for standalone use.)
 *
 * Call `setShielded(shielded)` once before `init()` (the default orchard entry is
 * eager; the browser wasm path needs cross-origin isolation, Node uses the
 * native addon).
 */
export declare class ShieldedProverWASM {
    /** @private **/
    _rawShieldedProver: ShieldedProverNAPI;
    /**
     * The proving key is deterministic and expensive (~10s), so it's built
     * once per process and shared by every prover instance. Cleared on
     * failure so a failed init can be retried.
     */
    private static _initPromise;
    constructor();
    init(): Promise<void>;
    static createFromRawInstance(rawInstance: ShieldedProverNAPI): ShieldedProverWASM;
}
