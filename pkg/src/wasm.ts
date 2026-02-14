import * as protocol from '../binaries/wasm.js'
import { setDpp } from './dpp/dpp.js'

setDpp(protocol)

export { KeyType, Purpose, PlatformVersionWASM, NetworkWASM, SecurityLevel } from './dpp/enums.js'
export { IdentityWASM, IdentifierWASM, IdentityPublicKeyWASM } from './dpp/dpp.js'

export * from './dpp/types.js'
export * from './dpp/utils.js'
