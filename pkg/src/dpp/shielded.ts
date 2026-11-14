import { dppProvider } from './provider.js'

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
      const mod = await import('../../binaries/shieldedCreation.cjs')
      // CJS interop: Node's cjs-module-lexer exposes `loadShielded` as a named
      // export, but browser bundlers (esbuild/webpack) cannot statically detect
      // it — shieldedCreation.cjs assigns module.exports conditionally (worker
      // branch vs main branch) — so they only provide `default`. Accept both.
      const loadShielded = mod.loadShielded ?? mod.default?.loadShielded
      if (typeof loadShielded !== 'function') {
        throw new Error('shieldedCreation module did not export loadShielded()')
      }
      dppProvider.setShielded(loadShielded())
    })().catch((e) => {
      initPromise = null
      throw e
    })
  }
  return initPromise
}
