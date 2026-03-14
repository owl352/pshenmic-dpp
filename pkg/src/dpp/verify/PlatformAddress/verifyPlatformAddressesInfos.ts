import {
  PlatformAddressLike,
  PlatformVersionLike, VerifiedPlatformAddressesInfosWithRootHash,
} from '../../types.js'
import {dppProvider} from '../../provider.js'
import {preparePlatformAddressValue, valueToDynamicValue} from '../../utils.js'
import {PlatformAddressWASM} from '../../structs/PlatformAddress/PlatformAddress.js'

export function verifyPlatformAddressesInfos(
  proof: Uint8Array,
  platformAddresses: PlatformAddressLike[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedPlatformAddressesInfosWithRootHash {
  const result = dppProvider.dpp.verifyAddressesInfos(
    proof,
    platformAddresses.map(preparePlatformAddressValue),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    infos: result.infos.map(({nonce, credits, address}) => ({
      nonce,
      balance: credits != null ? BigInt(credits) : undefined,
      address: PlatformAddressWASM.createFromRawInstance(address)
    }))
  }
}
