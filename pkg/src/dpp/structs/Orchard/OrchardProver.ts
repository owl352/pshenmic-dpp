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

  constructor () {
    this._rawOrchardProver = new dppProvider.dpp.OrchardProverNAPI()
  }

  static createFromRawInstance (rawInstance: OrchardProverNAPI): OrchardProverWASM {
    const instance: OrchardProverWASM = Object.create(OrchardProverWASM.prototype)
    instance._rawOrchardProver = rawInstance

    return instance
  }
}