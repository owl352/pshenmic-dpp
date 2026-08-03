import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedAddressesTrunkState } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { mapGroveAncestor, mapGroveElementEntry, mapGroveLeafInfo } from './utils.js'

/**
 * Verifies a trunk chunk proof for the address funds tree.
 *
 * The trunk covers the top of the tree only. Subtrees below it are truncated
 * and listed in `leafKeys`; use `traceKeyToLeaf` to find which one holds an
 * address, then fetch it with `verifyAddressesBranchState`.
 */
export function verifyAddressesTrunkState (
  proof: Uint8Array,
  platformVersion: PlatformVersionLike
): VerifiedAddressesTrunkState {
  const result = dppProvider.dpp.verifyAddressesTrunkState(
    proof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    elements: result.elements.map(mapGroveElementEntry),
    leafKeys: result.leafKeys.map(mapGroveLeafInfo),
    chunkDepths: result.chunkDepths,
    maxTreeDepth: result.maxTreeDepth,
    // These close over the verified result because tracing walks the proof's
    // reconstructed tree, which is not projected into plain data.
    traceKeyToLeaf: (key: Uint8Array) => {
      const leaf = result.traceKeyToLeaf(key)

      return leaf != null ? mapGroveLeafInfo(leaf) : undefined
    },
    getAncestor: (leafKey: Uint8Array, minPrivacyTreeCount: bigint) => {
      const ancestor = result.getAncestor(leafKey, minPrivacyTreeCount.toString())

      return ancestor != null ? mapGroveAncestor(ancestor) : undefined
    }
  }
}
