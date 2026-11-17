import { dppProvider } from '../../provider.js';
/**
 * Reusable Orchard prover holding the Halo 2 proving key. Building it is
 * expensive (~seconds); construct once and reuse. (The `ShieldedBuilderWASM`
 * already builds its own prover internally — this is exposed for standalone use.)
 *
 * Call `setShielded(loadShielded())` once before `init()` (the browser wasm path
 * needs cross-origin isolation; Node uses the native addon).
 */
export class OrchardProverWASM {
    /** @private **/
    _rawOrchardProver;
    /**
     * The proving key is deterministic and expensive (~10s), so it's built
     * once per process and shared by every prover instance. Cleared on
     * failure so a failed init can be retried.
     */
    static _initPromise = null;
    constructor() {
        // empty
    }
    async init() {
        if (OrchardProverWASM._initPromise == null) {
            OrchardProverWASM._initPromise = dppProvider.shielded.OrchardProverNAPI.init()
                .catch((e) => {
                OrchardProverWASM._initPromise = null;
                throw e;
            });
        }
        this._rawOrchardProver = await OrchardProverWASM._initPromise;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(OrchardProverWASM.prototype);
        instance._rawOrchardProver = rawInstance;
        return instance;
    }
}
