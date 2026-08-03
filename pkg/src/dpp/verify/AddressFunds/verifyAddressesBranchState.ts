import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedAddressesBranchState } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { mapGroveAncestor, mapGroveElementEntry, mapGroveLeafInfo } from './utils.js'

/**
 * Verifies a branch chunk proof for the address funds tree.
 *
 * `expectedRootHash` must be the `hash` the parent trunk or branch reported for
 * `key`; it is what anchors this subtree to the proven root, so the result
 * carries no root hash of its own.
 *
 * `depth` is validated against an allowed range, so take it from the parent
 * trunk's `chunkDepths` rather than picking a value.
 */
export function verifyAddressesBranchState (
  proof: Uint8Array,
  key: Uint8Array,
  depth: number,
  expectedRootHash: Uint8Array,
  platformVersion: PlatformVersionLike
): VerifiedAddressesBranchState {
  const result = dppProvider.dpp.verifyAddressesBranchState(
    proof,
    key,
    depth,
    expectedRootHash,
    valueToDynamicValue(platformVersion)
  )

  return {
    elements: result.elements.map(mapGroveElementEntry),
    leafKeys: result.leafKeys.map(mapGroveLeafInfo),
    branchRootHash: result.branchRootHash,
    traceKeyToLeaf: (traced: Uint8Array) => {
      const leaf = result.traceKeyToLeaf(traced)

      return leaf != null ? mapGroveLeafInfo(leaf) : undefined
    },
    getAncestor: (leafKey: Uint8Array, minPrivacyTreeCount: bigint) => {
      const ancestor = result.getAncestor(leafKey, minPrivacyTreeCount.toString())

      return ancestor != null ? mapGroveAncestor(ancestor) : undefined
    }
  }
}
