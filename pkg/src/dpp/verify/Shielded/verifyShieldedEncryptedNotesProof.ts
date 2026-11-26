import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedShieldedEncryptedNotes } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedEncryptedNotesProof (
  proof: Uint8Array,
  startIndex: bigint,
  count: number,
  maxElements: number,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike,
  tokenId?: IdentifierLike | null
): VerifiedShieldedEncryptedNotes {
  const result = dppProvider.dpp.verifyShieldedEncryptedNotesProof(
    proof,
    startIndex.toString(),
    count,
    maxElements,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion),
    tokenId != null ? prepareIdentifierValue(tokenId) : undefined
  )

  return {
    rootHash: result.rootHash,
    notes: result.notes.map((note) => ({
      cmx: note.cmx,
      nullifier: note.nullifier,
      cvNet: note.cvNet,
      encryptedNote: note.encryptedNote
    })),
    totalCount: BigInt(result.totalCount)
  }
}
