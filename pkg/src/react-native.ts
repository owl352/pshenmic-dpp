import * as protocol from '../binaries/pshenmic_dpp.js'
import { dppProvider } from './dpp/provider.js'

dppProvider.setDpp(protocol)
// The react-native addon carries the proving classes in the same instance, so
// the shielded slot points at it too — no separate on-demand load is needed.
dppProvider.setShielded(protocol)

/** No-op on react-native: the addon already includes the proving classes. */
export async function initShielded (): Promise<void> {
  // native module is loaded synchronously at import
}

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
