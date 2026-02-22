import * as protocol from '../binaries/pshenmic_dpp.js'
import { dppProvider } from './dpp/provider.js'

dppProvider.setDpp(protocol)

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
