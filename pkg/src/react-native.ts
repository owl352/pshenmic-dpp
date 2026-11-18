import * as protocol from '../binaries/pshenmic_dpp.js'
import { dppProvider } from './dpp/provider.js'

dppProvider.setDpp(protocol)

// dpp carries no proving code: the consumer provides the shielded proving module
// explicitly via setShielded(shielded) from dash-platform-shielded. React Native
// uses the module's threaded wasm (its native addon targets desktop platforms); the
// RN runtime must provide SharedArrayBuffer + wasm thread workers.
export { setShielded } from './dpp/shielded.js'

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'