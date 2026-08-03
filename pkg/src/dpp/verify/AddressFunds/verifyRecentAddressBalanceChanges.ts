import { dppProvider } from '../../provider.js'
import {
  AddressBalanceOperation,
  PlatformVersionLike,
  VerifiedRecentAddressBalanceChanges
} from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { PlatformAddressWASM } from '../../structs/PlatformAddress/PlatformAddress.js'

/**
 * Verifies a proof of the address balance changes from a block height onwards.
 *
 * `startHeightExclusive` must match the flag the proof was requested with: it
 * selects a range starting just past `startBlockHeight` rather than at it, and
 * the two produce different queries, so a mismatch fails verification.
 */
export function verifyRecentAddressBalanceChanges (
  proof: Uint8Array,
  startBlockHeight: bigint,
  startHeightExclusive: boolean,
  limit: number | undefined,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedRecentAddressBalanceChanges {
  const result = dppProvider.dpp.verifyRecentAddressBalanceChanges(
    proof,
    startBlockHeight.toString(),
    startHeightExclusive,
    limit,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    blocks: result.blocks.map((block) => ({
      blockHeight: BigInt(block.blockHeight),
      changes: block.changes.map((change) => ({
        address: PlatformAddressWASM.createFromRawInstance(change.address),
        operation: change.operation as AddressBalanceOperation,
        credits: BigInt(change.credits)
      }))
    }))
  }
}
