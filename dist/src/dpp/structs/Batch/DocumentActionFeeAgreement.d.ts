import type { AgreedFeeMultiplierNAPI, DocumentActionFeeAgreementNAPI } from '../../../../binaries/bindingsTypes.js';
import { BatchTypeLike } from '../../types.js';
import { DataContractWASM } from '../DataContract.js';
/** The epoch fee multiplier a document transition agrees to pay its action fee at, and how much it may grow before execution **/
export declare class AgreedFeeMultiplierWASM {
    /** @private **/
    _rawAgreedFeeMultiplier: AgreedFeeMultiplierNAPI;
    constructor(knownPermille: bigint, increaseTolerancePercent: number);
    get knownPermille(): bigint;
    set knownPermille(value: bigint);
    get increaseTolerancePercent(): number;
    set increaseTolerancePercent(value: number);
    /** Whether the current epoch fee multiplier (permille) is within the agreed tolerance **/
    tolerates(currentPermille: bigint): boolean;
    static createFromRawInstance(rawInstance: AgreedFeeMultiplierNAPI): AgreedFeeMultiplierWASM;
}
/** The action fee a document transition agrees to pay to the contract fee pots (protocol version 14) **/
export declare class DocumentActionFeeAgreementWASM {
    /** @private **/
    _rawDocumentActionFeeAgreement: DocumentActionFeeAgreementNAPI;
    /** A fee multiplier makes the agreement priced by the epoch fee multiplier, none makes it fixed **/
    constructor(owner: bigint, moderators: bigint, feeMultiplier?: AgreedFeeMultiplierWASM);
    /** The agreement to the fee the document type declares for the action, or undefined when the action charges no fee **/
    static forDocumentTypeAction(dataContract: DataContractWASM, documentTypeName: string, action: BatchTypeLike, feeMultiplier: AgreedFeeMultiplierWASM): DocumentActionFeeAgreementWASM | undefined;
    get owner(): bigint;
    set owner(value: bigint);
    get moderators(): bigint;
    set moderators(value: bigint);
    get feeMultiplier(): AgreedFeeMultiplierWASM | undefined;
    set feeMultiplier(value: AgreedFeeMultiplierWASM | undefined | null);
    get pricing(): 'feeMultiplier' | 'fixed';
    /**
     * Checks the agreement the way the network does before executing the transition: it must match the fee
     * the document type declares for the action, and, when priced by the fee multiplier, tolerate the current
     * epoch fee multiplier (from verifyEpochsInfoProof). An action that charges no fee always passes.
     * Agreements to an elected moderators discount are not covered.
     **/
    verify(dataContract: DataContractWASM, documentTypeName: string, action: BatchTypeLike, currentFeeMultiplierPermille?: bigint): boolean;
    static createFromRawInstance(rawInstance: DocumentActionFeeAgreementNAPI): DocumentActionFeeAgreementWASM;
}
