import { dppProvider } from '../provider.js';
import { prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
export class DocumentWASM {
    /** @private **/
    _rawDocument;
    constructor(documentContent, documentTypeName, revision, dataContractId, ownerId, documentId, creatorId) {
        this._rawDocument = new dppProvider.dpp.DocumentNAPI(valueToDynamicValue(documentContent), documentTypeName, revision.toString(), prepareIdentifierValue(dataContractId), prepareIdentifierValue(ownerId), documentId != null ? prepareIdentifierValue(documentId) : undefined, creatorId != null ? prepareIdentifierValue(creatorId) : undefined);
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawDocument.id);
    }
    set id(id) {
        this._rawDocument.id = prepareIdentifierValue(id);
    }
    get entropy() {
        return this._rawDocument.entropy ?? undefined;
    }
    set entropy(value) {
        this._rawDocument.entropy = value;
    }
    get dataContractId() {
        return IdentifierWASM.createFromRawInstance(this._rawDocument.dataContractId);
    }
    set dataContractId(value) {
        this._rawDocument.dataContractId = prepareIdentifierValue(value);
    }
    get ownerId() {
        return IdentifierWASM.createFromRawInstance(this._rawDocument.ownerId);
    }
    set ownerId(value) {
        this._rawDocument.ownerId = prepareIdentifierValue(value);
    }
    get properties() {
        return valueFromDynamicValue(this._rawDocument.properties);
    }
    set properties(value) {
        this._rawDocument.properties = valueToDynamicValue(value);
    }
    get revision() {
        const revision = this._rawDocument.revision;
        return revision != null ? BigInt(revision) : undefined;
    }
    set revision(value) {
        this._rawDocument.revision = value?.toString();
    }
    get createdAt() {
        const createdAt = this._rawDocument.createdAt;
        if (createdAt != null) {
            return BigInt(createdAt);
        }
    }
    set createdAt(timestamp) {
        if (timestamp instanceof Date) {
            this._rawDocument.createdAt = timestamp.getTime().toString();
        }
        else if (timestamp == null) {
            this._rawDocument.createdAt = undefined;
        }
        else {
            this._rawDocument.createdAt = timestamp.toString();
        }
    }
    get updatedAt() {
        const updatedAt = this._rawDocument.updatedAt;
        if (updatedAt != null) {
            return BigInt(updatedAt);
        }
    }
    set updatedAt(timestamp) {
        if (timestamp instanceof Date) {
            this._rawDocument.updatedAt = timestamp.getTime().toString();
        }
        else if (timestamp == null) {
            this._rawDocument.updatedAt = undefined;
        }
        else {
            this._rawDocument.updatedAt = timestamp.toString();
        }
    }
    get transferredAt() {
        const transferredAt = this._rawDocument.transferredAt;
        if (transferredAt != null) {
            return BigInt(transferredAt);
        }
    }
    set transferredAt(timestamp) {
        if (timestamp instanceof Date) {
            this._rawDocument.transferredAt = timestamp.getTime().toString();
        }
        else if (timestamp == null) {
            this._rawDocument.transferredAt = undefined;
        }
        else {
            this._rawDocument.transferredAt = timestamp.toString();
        }
    }
    get createdAtBlockHeight() {
        const createdAtBlockHeight = this._rawDocument.createdAtBlockHeight;
        if (createdAtBlockHeight != null) {
            return BigInt(createdAtBlockHeight);
        }
    }
    set createdAtBlockHeight(value) {
        this._rawDocument.createdAtBlockHeight = value?.toString();
    }
    get updatedAtBlockHeight() {
        const updatedAtBlockHeight = this._rawDocument.createdAtBlockHeight;
        if (updatedAtBlockHeight != null) {
            return BigInt(updatedAtBlockHeight);
        }
    }
    set updatedAtBlockHeight(value) {
        this._rawDocument.createdAtBlockHeight = value?.toString();
    }
    get transferredAtBlockHeight() {
        const transferredAtBlockHeight = this._rawDocument.createdAtBlockHeight;
        if (transferredAtBlockHeight != null) {
            return BigInt(transferredAtBlockHeight);
        }
    }
    set transferredAtBlockHeight(value) {
        this._rawDocument.createdAtBlockHeight = value?.toString();
    }
    get createdAtCoreBlockHeight() {
        return this._rawDocument.createdAtCoreBlockHeight ?? undefined;
    }
    set createdAtCoreBlockHeight(value) {
        this._rawDocument.createdAtCoreBlockHeight = value;
    }
    get updatedAtCoreBlockHeight() {
        return this._rawDocument.updatedAtCoreBlockHeight ?? undefined;
    }
    set updatedAtCoreBlockHeight(value) {
        this._rawDocument.createdAtCoreBlockHeight = value;
    }
    get transferredAtCoreBlockHeight() {
        return this._rawDocument.transferredAtCoreBlockHeight ?? undefined;
    }
    set transferredAtCoreBlockHeight(value) {
        this._rawDocument.createdAtCoreBlockHeight = value;
    }
    get documentTypeName() {
        return this._rawDocument.documentTypeName;
    }
    set documentTypeName(value) {
        this._rawDocument.documentTypeName = value;
    }
    get creatorId() {
        const id = this._rawDocument.creatorId;
        if (id != null) {
            return IdentifierWASM.createFromRawInstance(id);
        }
    }
    set creatorId(value) {
        this._rawDocument.creatorId = prepareIdentifierValue(value);
    }
    bytes(dataContract, platformVersion) {
        return this._rawDocument.bytes(dataContract._rawDataContract, valueToDynamicValue(platformVersion));
    }
    hex(dataContract, platformVersion) {
        return this._rawDocument.hex(dataContract._rawDataContract, valueToDynamicValue(platformVersion));
    }
    base64(dataContract, platformVersion) {
        return this._rawDocument.base64(dataContract._rawDataContract, valueToDynamicValue(platformVersion));
    }
    static fromBytes(bytes, dataContract, documentTypeName, platformVersion) {
        return DocumentWASM.createFromRawInstance(dppProvider.dpp.DocumentNAPI.fromBytes(bytes, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion)));
    }
    static fromHex(hex, dataContract, documentTypeName, platformVersion) {
        return DocumentWASM.createFromRawInstance(dppProvider.dpp.DocumentNAPI.fromHex(hex, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion)));
    }
    static fromBase64(base64, dataContract, documentTypeName, platformVersion) {
        return DocumentWASM.createFromRawInstance(dppProvider.dpp.DocumentNAPI.fromBase64(base64, dataContract._rawDataContract, documentTypeName, valueToDynamicValue(platformVersion)));
    }
    static generateId(documentTypeName, ownerId, dataContractId, entropy) {
        return IdentifierWASM.createFromRawInstance(dppProvider.dpp.DocumentNAPI.generateId(documentTypeName, prepareIdentifierValue(ownerId), prepareIdentifierValue(dataContractId), entropy));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(DocumentWASM.prototype);
        instance._rawDocument = rawInstance;
        return instance;
    }
}
