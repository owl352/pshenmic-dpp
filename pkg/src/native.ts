// @ts-ignore
import protocol from '../binaries/node.cjs'
import { dppProvider } from './dpp/provider.js'
import { initShielded as initShieldedOrchard } from './dpp/shielded.js'

// @ts-ignore
dppProvider.setDpp(protocol)

/**
 * dpp carries no proving code: the shielded (Orchard/Halo 2) module is the
 * separate pshenmic-orchard package, loaded on demand (import 'pshenmic-orchard'
 * first). On Node, orchard prefers its native Node-API addon (~3x faster
 * proving); the threaded wasm is the fallback / browser path.
 */
export async function initShielded (): Promise<void> {
  await initShieldedOrchard()
}

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'