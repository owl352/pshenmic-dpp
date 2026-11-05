import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedPathElements } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'
import { mapGroveElement } from '../AddressFunds/utils.js'

/**
 * Verifies a `getPathElements` proof: the elements stored under `keys` in the subtree at `path`
 */
export function verifyPathElementsProof (
  proof: Uint8Array,
  path: Uint8Array[],
  keys: Uint8Array[],
  platformVersion: PlatformVersionLike
): VerifiedPathElements {
  const result = dppProvider.dpp.verifyPathElementsProof(
    proof,
    path,
    keys,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    elements: result.elements.map(({ key, element }) => ({
      key,
      element: element != null ? mapGroveElement(element) : undefined
    }))
  }
}
