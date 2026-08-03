import { dppProvider } from '../../provider.js'
import {
  CompactedAddressBalanceOperation,
  PlatformVersionLike,
  VerifiedRecentCompactedAddressBalanceChanges
} from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { PlatformAddressWASM } from '../../structs/PlatformAddress/PlatformAddress.js'

/**
 * Verifies a proof of the compacted address balance changes from a block height
 * onwards, where each entry merges a range of blocks.
 *
 * There is no subset flag here: the proof is a self-contained envelope whose
 * predecessor half authenticates which range covers the requested height, so
 * the forward half has nothing to be a subset of.
 */
export function verifyRecentCompactedAddressBalanceChanges (
  proof: Uint8Array,
  startBlockHeight: bigint,
  limit: number | undefined,
  platformVersion: PlatformVersionLike
): VerifiedRecentCompactedAddressBalanceChanges {
  const result = dppProvider.dpp.verifyRecentCompactedAddressBalanceChanges(
    proof,
    startBlockHeight.toString(),
    limit,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    ranges: result.ranges.map((range) => ({
      startBlockHeight: BigInt(range.startBlockHeight),
      endBlockHeight: BigInt(range.endBlockHeight),
      changes: range.changes.map((change) => ({
        address: PlatformAddressWASM.createFromRawInstance(change.address),
        operation: change.operation as CompactedAddressBalanceOperation,
        setCredits: change.setCredits != null ? BigInt(change.setCredits) : undefined,
        addToCreditsOperations: change.addToCreditsOperations.map((operation) => ({
          blockHeight: BigInt(operation.blockHeight),
          credits: BigInt(operation.credits)
        }))
      }))
    }))
  }
}
