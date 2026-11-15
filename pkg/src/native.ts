// @ts-ignore
import protocol from '../binaries/node.cjs'
import { dppProvider } from './dpp/provider.js'
import { initShielded as initShieldedWasm } from './dpp/shielded.js'

// @ts-ignore
dppProvider.setDpp(protocol)
// The native addon carries the proving classes in the same instance, so the
// shielded slot points at it too. When node.cjs falls back to the BASE wasm
// (addon missing/unusable), the proving classes are absent: leave the slot
// unset so initShielded() can load the threaded shielded module on demand
// instead of pointing the shielded slot at a base-only module.
if (protocol.ShieldedBuilderNAPI != null) {
  // @ts-ignore
  dppProvider.setShielded(protocol)
}

/**
 * No-op when the native addon carries the proving classes. On the base-wasm
 * fallback it delegates to the wasm on-demand loader, so proving still works.
 */
export async function initShielded (): Promise<void> {
  if (protocol.ShieldedBuilderNAPI != null) {
    // native module is loaded synchronously at import
    return
  }
  await initShieldedWasm()
}

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
