import { dppProvider } from '../provider.js';
export function verifySignatureDigest(signDigest, signature, pubkeyBytes) {
    return dppProvider.dpp.verifySignatureDigest(signDigest, signature, pubkeyBytes);
}
