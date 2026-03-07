import {
  PlatformAddressLike,
  PlatformVersionLike,
  VerifiedPlatformAddressInfoWithRootHash
} from '../../types.js'
import { dppProvider } from '../../provider.js'
import { preparePlatformAddressValue, valueToDynamicValue } from '../../utils.js'
import { PlatformAddressWASM } from '../../structs/PlatformAddress/PlatformAddress.js'

export function verifyPlatformAddressInfo (
  proof: Uint8Array,
  platformAddress: PlatformAddressLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedPlatformAddressInfoWithRootHash {
  const result = dppProvider.dpp.verifyAddressInfo(
    proof,
    preparePlatformAddressValue(platformAddress),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    address: result.address != null ? PlatformAddressWASM.createFromRawInstance(result.address) : undefined,
    balance: result.balance != null ? BigInt(result.balance) : undefined,
    nonce: result.nonce
  }
}
