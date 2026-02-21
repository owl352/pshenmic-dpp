import { dppProvider } from '../provider.js'

export function verifySignatureDigest (signDigest: Uint8Array, signature: Uint8Array, pubkeyBytes: Uint8Array): boolean {
  return dppProvider.dpp.verifySignatureDigest(signDigest, signature, pubkeyBytes)
}
