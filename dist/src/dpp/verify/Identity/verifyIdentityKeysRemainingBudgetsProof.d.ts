import { IdentifierLike, PlatformVersionLike, ProvenKeyRemainingBudget, VerifiedProof } from '../../types.js';
/** What is left of the budget of each requested key; `remainingBudget` is null for a key without a budget **/
export declare function verifyIdentityKeysRemainingBudgetsProof(proof: Uint8Array, identityId: IdentifierLike, keyIds: number[], verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenKeyRemainingBudget[]>;
