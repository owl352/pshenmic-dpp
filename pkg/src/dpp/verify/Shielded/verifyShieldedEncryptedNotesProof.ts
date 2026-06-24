import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedShieldedEncryptedNotes } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyShieldedEncryptedNotesProof (
  proof: Uint8Array,
  startIndex: bigint,
  count: number,
  maxElements: number,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedShieldedEncryptedNotes {
  const result = dppProvider.dpp.verifyShieldedEncryptedNotesProof(
    proof,
    startIndex.toString(),
    count,
    maxElements,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
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