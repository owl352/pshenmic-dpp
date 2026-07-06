import type { OrchardProverNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

/**
 * Reusable Orchard prover holding the Halo 2 proving key. Building it is
 * expensive (~seconds); construct once and reuse. (The `ShieldedBuilderWASM`
 * already builds its own prover internally — this is exposed for standalone use.)
 */
export class OrchardProverWASM {
  /** @private **/
  _rawOrchardProver: OrchardProverNAPI

  /**
   * The proving key is deterministic and expensive (~10s), so it's built
   * once per process and shared by every prover instance. Cleared on
   * failure so a failed init can be retried.
   */
  private static _initPromise: Promise<OrchardProverNAPI> | null = null

  constructor () {
    // empty
  }

  async init(): Promise<void>  {
    if (OrchardProverWASM._initPromise == null) {
      OrchardProverWASM._initPromise = dppProvider.dpp.OrchardProverNAPI.init()
        .catch((e: Error) => {
          OrchardProverWASM._initPromise = null
          throw e
        })
    }
    this._rawOrchardProver = await OrchardProverWASM._initPromise
  }

  static createFromRawInstance (rawInstance: OrchardProverNAPI): OrchardProverWASM {
    const instance: OrchardProverWASM = Object.create(OrchardProverWASM.prototype)
    instance._rawOrchardProver = rawInstance

    return instance
  }
}
