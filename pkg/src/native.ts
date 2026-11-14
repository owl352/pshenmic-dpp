// @ts-ignore
import protocol from '../binaries/node.cjs'
import { dppProvider } from './dpp/provider.js'

// @ts-ignore
dppProvider.setDpp(protocol)
// The native addon carries the proving classes in the same instance, so the
// shielded slot points at it too — no separate on-demand load is needed.
dppProvider.setShielded(protocol)

/** No-op on native: the addon already includes the proving classes. */
export async function initShielded (): Promise<void> {
  // native module is loaded synchronously at import
}

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
