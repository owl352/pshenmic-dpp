// @ts-ignore
import protocol from '../binaries/node.cjs'
import { dppProvider } from './dpp/provider.js'

// @ts-ignore
dppProvider.setDpp(protocol)

/** Raw base NAPI instance. */
export const dpp = protocol

export * from './dpp/enums.js'
export * from './dpp/dpp.js'

export * from './dpp/types.js'
