import { dppProvider } from './provider.js'
import type { ShieldedProtocol } from './types.js'

/**
 * Provide the shielded (Orchard/Halo 2 proving) module from the separate
 * dash-platform-shielded package: `setShielded(shielded)`. The default entry eagerly
 * instantiates the module (native Node-API addon on Node, threaded wasm
 * elsewhere); use `dash-platform-shielded/lazy` + `loadShielded()` when the load must
 * be deferred (non-isolated pages, SSR, workers).
 *
 * Both imports are static, so this survives bundler renaming with no global
 * registry involved. The wasm path needs SharedArrayBuffer (cross-origin
 * isolation in browsers); the base dpp module loads without it
 * (dash-platform-extension#219).
 */
export function setShielded (shielded: ShieldedProtocol): void {
  if (shielded == null || typeof shielded !== 'object') {
    throw new Error('setShielded expects the shielded module exported by dash-platform-shielded.')
  }
  dppProvider.setShielded(shielded)
}
