import { GroupActionStatusLike, IdentifierLike, PlatformVersionLike, VerifiedProof } from '../../types.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
/** The members who approved a contract team action **/
export declare function verifyContractTeamActionSignersProof(proof: Uint8Array, contractId: IdentifierLike, status: GroupActionStatusLike, actionId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<IdentifierWASM[]>;
