import type { DocumentBaseTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { IdentifierLike } from '../../types.js';
import { TokenPaymentInfoWASM } from './TokenPaymentInfo.js';
import { DocumentActionFeeAgreementWASM } from './DocumentActionFeeAgreement.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class DocumentBaseTransitionWASM {
    /** @private **/
    _rawDocumentBaseTransition: DocumentBaseTransitionNAPI;
    constructor(documentId: IdentifierLike, identityContractNonce: bigint, documentTypeName: string, dataContractId: IdentifierLike, tokenPaymentInfo?: TokenPaymentInfoWASM, actionFeeAgreement?: DocumentActionFeeAgreementWASM);
    /** 2 when the base carries an action fee agreement (protocol version 14), 1 otherwise **/
    get featureVersion(): number;
    get actionFeeAgreement(): DocumentActionFeeAgreementWASM | undefined;
    /** Setting an agreement on a V0 / V1 base upgrades it to V2 **/
    set actionFeeAgreement(actionFeeAgreement: DocumentActionFeeAgreementWASM | undefined | null);
    get id(): IdentifierWASM;
    set id(id: IdentifierLike);
    get identityContractNonce(): bigint;
    set identityContractNonce(identityContractNonce: bigint);
    get dataContractId(): IdentifierWASM;
    set dataContractId(id: IdentifierLike);
    get documentTypeName(): string;
    set documentTypeName(name: string);
    get tokenPaymentInfo(): TokenPaymentInfoWASM | undefined;
    set tokenPaymentInfo(tokenPaymentInfo: TokenPaymentInfoWASM | undefined);
    static createFromRawInstance(rawInstance: DocumentBaseTransitionNAPI): DocumentBaseTransitionWASM;
}
