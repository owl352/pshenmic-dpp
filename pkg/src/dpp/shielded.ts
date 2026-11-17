import { dppProvider } from './provider.js'
import type { ShieldedProtocol } from './types.js'

/**
 * Provide the shielded (Orchard/Halo 2 proving) module from the separate
 * pshenmic-orchard package: `setShielded(loadShielded())`. The consumer imports
 * the package and hands dpp its shielded instance — both imports are static, so
 * this survives bundler renaming with no global registry involved.
 *
 * Its loadShielded() prefers the native Node-API addon on Node (~3x faster
 * proving) and falls back to the threaded wasm module in browsers / when the
 * addon is unavailable for the platform. The wasm path needs SharedArrayBuffer
 * (cross-origin isolation in browsers); the base dpp module loads without it
 * (dash-platform-extension#219).
 */
export function setShielded (shielded: ShieldedProtocol): void {
  if (shielded == null || typeof shielded !== 'object') {
    throw new Error('setShielded expects the shielded module instance returned by loadShielded().')
  }
  dppProvider.setShielded(shielded)
}
