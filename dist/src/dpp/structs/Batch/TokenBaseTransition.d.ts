import type { TokenBaseTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { GroupStateTransitionInfoWASM } from '../GroupStateTransitionInfo.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class TokenBaseTransitionWASM {
    /** @private **/
    _rawTokenBaseTransition: TokenBaseTransitionNAPI;
    constructor(identityContractNonce: bigint, tokenContractPosition: number, dataContractId: IdentifierLike, tokenId: IdentifierLike, usingGroupInfo?: GroupStateTransitionInfoWASM);
    get identityContractNonce(): bigint;
    set identityContractNonce(value: bigint);
    get tokenContractPosition(): number;
    set tokenContractPosition(value: number);
    get dataContractId(): IdentifierWASM;
    set dataContractId(value: IdentifierLike);
    get tokenId(): IdentifierWASM;
    set tokenId(value: IdentifierLike);
    get usingGroupInfo(): GroupStateTransitionInfoWASM | undefined;
    set usingGroupInfo(value: GroupStateTransitionInfoWASM | undefined);
    static createFromRawInstance(rawInstance: TokenBaseTransitionNAPI): TokenBaseTransitionWASM;
}
