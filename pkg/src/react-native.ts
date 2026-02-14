import * as protocol from '../binaries/pshenmic_dpp.js'
import { setDpp } from './dpp/dpp.js'

setDpp(protocol)

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
