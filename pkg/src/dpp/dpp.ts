import {DashPlatformProtocol} from '../types.js'
import {dppProvider} from "./provider.js";

export {IdentifierWASM} from './structs/Identifier.js'
export {IdentityWASM} from './structs/Identity.js'
export {IdentityPublicKeyWASM} from './structs/IdentityPublicKey.js'
export {ConsensusErrorWASM} from './structs/ConsensusError.js'
export {InstantLockWASM} from './structs/InstantLock.js'
export {AssetLockProofWASM} from './structs/AssetLockProof/AssetLockProof.js'
export {ChainAssetLockProofWASM} from './structs/AssetLockProof/ChainLock.js'
export {InstantAssetLockProofWASM} from './structs/AssetLockProof/InstantAssetLockProof.js'
export {OutPointWASM} from './structs/AssetLockProof/OutPoint.js'
export {TxOutWASM} from './structs/AssetLockProof/TxOut.js'

export function setDpp(dpp: DashPlatformProtocol): void {
  dppProvider.setDpp(dpp);
}
