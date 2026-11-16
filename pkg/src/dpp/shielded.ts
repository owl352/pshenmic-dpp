import { dppProvider } from './provider.js'
import type { DashPlatformProtocol } from './types.js'

/**
 * On-demand loader for the shielded (threaded Orchard/Halo 2 proving) wasm
 * module — the wasm entry's counterpart to the native addon, which carries
 * every class in one instance.
 *
 * The base module loads at import WITHOUT cross-origin isolation
 * (dash-platform-extension#219). Proving needs shared memory and wasm thread
 * workers, so the shielded bytes are only decoded/compiled here, on first
 * use, and the result is installed as `dppProvider.shielded`.
 *
 * Idempotent: the load promise is cached, so concurrent/repeated calls share
 * one module instance (one 64MB shared memory + worker pool). Cleared on
 * failure so a failed init can be retried.
 */
let initPromise: Promise<void> | null = null

// Non-async on purpose: returns the cached promise ITSELF, so concurrent and
// repeated calls are observably one load (same promise, same module instance).
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function initShielded (): Promise<void> {
  // wasm threads require shared memory: SharedArrayBuffer is only exposed in
  // cross-origin-isolated browsers (COOP/COEP headers) and in Node. Gate on
  // every call so the error is clear even after a successful load.
  if (typeof SharedArrayBuffer === 'undefined') {
    return Promise.reject(new Error(
      'Shielded proving requires SharedArrayBuffer, which is not available in this environment. ' +
      'Browsers only expose it under cross-origin isolation (serve the page with COOP/COEP headers); ' +
      'Node.js provides it by default.'
    ))
  }
  if (initPromise == null) {
    initPromise = (async () => {
      // pshenmic-orchard registers its loader on this cross-realm global symbol
      // when imported. Discovering it by symbol (not by module name) survives
      // bundler renaming and duplicate dpp copies in a bundle.
      const registry = (globalThis as Record<symbol, { loadShielded?: () => DashPlatformProtocol }>)[
        Symbol.for('pshenmic-dpp.shielded')
      ]
      if (typeof registry?.loadShielded !== 'function') {
        throw new Error(
          'Shielded proving requires the pshenmic-orchard package. Install it and import it once ' +
          "(import 'pshenmic-orchard'), then call initShielded()."
        )
      }
      dppProvider.setShielded(registry.loadShielded())
    })().catch((e) => {
      initPromise = null
      throw e
    })
  }
  return initPromise
}
