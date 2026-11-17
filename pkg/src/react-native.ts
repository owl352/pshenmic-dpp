import * as protocol from '../binaries/pshenmic_dpp.js'
import { dppProvider } from './dpp/provider.js'
import { initShielded as initShieldedOrchard } from './dpp/shielded.js'

dppProvider.setDpp(protocol)

/**
 * dpp carries no proving code: the shielded (Orchard/Halo 2) module is the
 * separate pshenmic-orchard package, loaded on demand via initShielded().
 * React Native uses orchard's threaded wasm (its native addon targets desktop
 * platforms); the RN runtime must provide SharedArrayBuffer + wasm thread workers.
 */
export async function initShielded (): Promise<void> {
  await initShieldedOrchard()
}

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'