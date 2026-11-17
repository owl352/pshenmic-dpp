import type { OrchardProtocol } from './types.js';
/**
 * Provide the shielded (Orchard/Halo 2 proving) module from the separate
 * pshenmic-orchard package: `setShielded(loadShielded())`. The consumer imports
 * orchard and hands dpp its instance — both imports are static, so this survives
 * bundler renaming with no global registry involved.
 *
 * orchard's loadShielded() prefers its native Node-API addon on Node (~3x faster
 * proving) and falls back to the threaded wasm module in browsers / when the
 * addon is unavailable for the platform. The wasm path needs SharedArrayBuffer
 * (cross-origin isolation in browsers); the base dpp module loads without it
 * (dash-platform-extension#219).
 */
export declare function setShielded(orchard: OrchardProtocol): void;
