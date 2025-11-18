import * as protocol from '../binaries/wasm.js'
import { setDpp } from './dpp/dpp.js'

setDpp(protocol)

export { KeyType, Purpose, PlatformVersionWASM, NetworkWASM, SecurityLevel } from './enums.js'
export { IdentityWASM, IdentifierWASM, IdentityPublicKeyWASM } from './dpp/dpp.js'

export * from './types.js'
